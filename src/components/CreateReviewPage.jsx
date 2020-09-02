import React, { useEffect, useReducer, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Divider, List, Segment, Header, Grid } from "semantic-ui-react";

import Form, { FormGroup, SubmitConfirm } from "components/common/Form";
import {
  DropdownInput,
  RadioInputGroup,
  TextAreaInput,
  SearchInput,
  TextInput,
  SEARCH_INPUT_ADD_ENTITY_ID,
} from "components/common/Inputs";

const PROFESSOR_SEARCH_CHANGE = "PROFESSOR_SEARCH_CHANGE";
const COURSE_SEARCH_CHANGE = "COURSE_SEARCH_CHANGE";
const SELECT_PROFESSOR = "SELECT_PROFESSOR";
const SELECT_ADD_PROFESSOR = "SELECT_ADD_PROFESSOR";
const SELECT_SEARCH_COURSES = "SELECT_SEARCH_COURSES";
const SELECT_COURSE = "SELECT_COURSE";
const SELECT_ADD_COURSE = "SELECT_ADD_COURSE";
const SELECT_NEW_COURSE = "SELECT_NEW_COURSE";
const SET_COURSE_OPTIONS = "SET_COURSE_OPTIONS";
const SET_DEPARTMENT_OPTIONS = "SET_DEPARTMENT_OPTIONS";

function reviewFormReducer(state, action) {
  switch (action.type) {
    case PROFESSOR_SEARCH_CHANGE:
      return {
        ...state,
        professorSelected: false,
      };
    case COURSE_SEARCH_CHANGE:
      return {
        ...state,
        addCourse: false,
      };
    case SELECT_PROFESSOR:
      return {
        ...state,
        professorSelected: true,
        courseOptions: [],
        addProfessor: false,
        addCourse: false,
        searchAllCourses: false,
      };
    case SET_COURSE_OPTIONS:
      return {
        ...state,
        courseOptions: action.payload,
      };
    case SET_DEPARTMENT_OPTIONS:
      return {
        ...state,
        departmentOptions: action.payload,
      };
    case SELECT_ADD_PROFESSOR:
      return {
        ...state,
        professorSelected: false,
        courseOptions: [],
        addProfessor: true,
      };
    case SELECT_SEARCH_COURSES:
      return {
        ...state,
        searchAllCourses: true,
      };
    case SELECT_COURSE:
      return {
        ...state,
        searchAllCourses: false,
        addCourse: false,
      };
    case SELECT_ADD_COURSE:
      return {
        ...state,
        addCourse: true,
      };
    case SELECT_NEW_COURSE:
      return {
        ...state,
        addCourses: false,
      };
    default:
      throw new Error(`invalid type ${action.type}`);
  }
}

export default function CreateReviewPage() {
  const history = useHistory();

  const [
    {
      professorSelected,
      courseOptions,
      addProfessor,
      addCourse,
      searchAllCourses,
      departmentOptions,
    },
    dispatch,
  ] = useReducer(reviewFormReducer, {
    professorSelected: false,
    courseOptions: [],
    addProfessor: false,
    addCourse: false,
    searchAllCourses: false,
    departmentOptions: [],
  });

  /* * * * * * * * * * * * * * * * *
   * Form contents                 *
   * * * * * * * * * * * * * * * * */

  const evaluationTexts = [
    "One of the worst experiences at Columbia. Avoid at all costs",
    "Strong negative experience. Take only if necessary",
    "Both negatives and positives much like life itself",
    "Strong positive experience. Take if possible",
    "A Columbia gem. Life-changing moments await",
  ];

  const evaluationLabels = evaluationTexts.map((label, idx) => {
    return {
      label,
      key: idx + 1,
    };
  });

  const confirmContent = (
    <>
      Your review <u>will not be published if it is</u>
      <List bulleted>
        <List.Item>Discriminatory or inappropriate</List.Item>
        <List.Item>About a nonexisting professor or course</List.Item>
        <List.Item>Libelous or defamatory</List.Item>
      </List>
      CULPA maintains the right to reject or remove any review.
    </>
  );

  /* * * * * * * * * * * * * * * * *
   * Form methods                  *
   * * * * * * * * * * * * * * * * */
  const onSubmitReview = async (data) => {
    const response = await fetch("/api/review/submit", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    try {
      return await response.json();
    } catch (err) {
      return { error: err };
    }
  };

  const onSubmitReviewSuccess = (res) => {
    history.push(`/review/${res.reviewId}`);
  };

  /* * * * * * * * * * * * * * * * *
   * Professor Search methods      *
   * * * * * * * * * * * * * * * * */

  const searchAllCoursesId = -1;

  const onProfessorResultSelect = async ({ id: professorId }) => {
    if (professorId === SEARCH_INPUT_ADD_ENTITY_ID) {
      dispatch({ type: SELECT_ADD_PROFESSOR });
      return null;
    }

    dispatch({ type: SELECT_PROFESSOR });
    const response = await fetch(`/api/professor/${professorId}/courses`, {
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    });

    try {
      const { courses } = await response.json();

      if (response.ok) {
        courses.push({
          text: `Course not listed. Add course.`,
          value: searchAllCoursesId,
          key: `Course not listed. Add course.`,
        });
        dispatch({ type: SET_COURSE_OPTIONS, payload: courses });
      }
    } catch (err) {
      return { error: err };
    }
    return null;
  };

  const onProfessorSearchChange = () => {
    dispatch({ type: PROFESSOR_SEARCH_CHANGE });
  };

  /* * * * * * * * * * * * * * * * *
   * Course Dropdown methods       *
   * * * * * * * * * * * * * * * * */

  const onOptionSelect = (courseId) => {
    courseId === searchAllCoursesId
      ? dispatch({ type: SELECT_SEARCH_COURSES })
      : dispatch({ type: SELECT_COURSE });
  };

  /* * * * * * * * * * * * * * * * *
   * Add Professor/Course Methods  *
   * * * * * * * * * * * * * * * * */

  // Prevent initial render from fetching data
  const firstRender = useRef(true);

  // Fetch departments if addProfessor or addCourse is set and not the
  // initial render.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (departmentOptions.length) return;
    const fetchDepartmentOptions = async () => {
      const response = await fetch(`/api/department/all?option=1`, {
        method: "GET",
        headers: { "Content-Type": "Application/json" },
      });

      const { departments } = await response.json();

      if (response.ok) {
        dispatch({ type: SET_DEPARTMENT_OPTIONS, payload: departments });
      }
    };

    fetchDepartmentOptions();
  }, [addProfessor, addCourse, departmentOptions]);

  const onCourseResultSelect = ({ id: courseId }) => {
    courseId === SEARCH_INPUT_ADD_ENTITY_ID
      ? dispatch({ type: SELECT_ADD_COURSE })
      : dispatch({ type: SELECT_NEW_COURSE });
  };

  const onCourseSearchChange = () => {
    dispatch({ type: COURSE_SEARCH_CHANGE });
  };

  /* * * * * * * * * * * * * * * * *
   * Add Professor/Course Content  *
   * * * * * * * * * * * * * * * * */

  const searchAllCoursesInput = (
    <>
      <Header>Search All Courses</Header>
      <SearchInput
        addNewEntity
        label="Select course"
        name="newCourse.search"
        rules={{ required: "Please search for a course" }}
        searchEntity="course"
        searchLimit={7}
        width={12}
        onResultSelect={onCourseResultSelect}
        onSearchChange={onCourseSearchChange}
      />
    </>
  );

  const addProfessorInputs = (
    <>
      <Header>Add New Professor</Header>
      <FormGroup>
        <TextInput
          label="New Professor First Name"
          name="newProfessor.first_name"
          rules={{ required: "Missing first name for new professor" }}
          width={6}
        />
        <TextInput
          label="New Professor Last Name"
          name="newProfessor.last_name"
          rules={{ required: "Missing last name for new professor" }}
          width={6}
        />
      </FormGroup>
      <TextInput
        label="New Professor UNI"
        name="newProfessor.uni"
        rules={{ required: "Missing professor uni" }}
        width={12}
      />
      <DropdownInput
        label="New Professor Department"
        name="newProfessor.department"
        options={departmentOptions}
        rules={{ required: "Missing department for new professor" }}
        width={12}
      />
      <SearchInput
        addNewEntity
        label="Select a course to review for the new professor"
        name="newProfessor.course"
        rules={{ required: "Missing course for new professor" }}
        searchEntity="course"
        searchLimit={7}
        width={12}
        onResultSelect={onCourseResultSelect}
        onSearchChange={onCourseSearchChange}
      />
    </>
  );

  const addCourseInputs = (
    <>
      <Header>Add New Course</Header>
      <TextInput
        label="New Course Name"
        name="newCourse.name"
        rules={{ required: "Missing name for new course" }}
        width={12}
      />
      <TextInput
        label="New Course Code"
        name="newCourse.code"
        rules={{ required: "Missing course code for new course" }}
        width={12}
      />
      <DropdownInput
        label="Select department"
        name="newCourse.department"
        options={departmentOptions}
        rules={{ required: "Please select a department" }}
        width={12}
      />
    </>
  );

  return (
    <>
      <h1>Write a Review</h1>
      <Form
        mode="onChange"
        onSubmit={onSubmitReview}
        onSuccess={onSubmitReviewSuccess}
      >
        <SearchInput
          addNewEntity
          disabled={addProfessor}
          label="Professor"
          name="professor"
          placeholder="Search for professors"
          rules={{ required: "Please select a professor" }}
          searchEntity="professor"
          searchLimit={7}
          width={6}
          onResultSelect={onProfessorResultSelect}
          onSearchChange={onProfessorSearchChange}
        />
        {professorSelected && (
          <DropdownInput
            label="Course"
            name="course"
            options={courseOptions}
            placeholder={
              professorSelected ? "" : "Please select a Professor first"
            }
            rules={{ required: "Please select a matching course" }}
            width={6}
            onOptionSelect={onOptionSelect}
          />
        )}
        {(addProfessor || addCourse || searchAllCourses) && (
          <Segment padded>
            <Grid columns={2}>
              <Grid.Column>
                {addProfessor
                  ? addProfessorInputs
                  : searchAllCourses && searchAllCoursesInput}
              </Grid.Column>
              <Grid.Column>{addCourse && addCourseInputs}</Grid.Column>
            </Grid>
          </Segment>
        )}
        <Divider section />
        <TextAreaInput
          label="Content"
          name="content"
          rows={8}
          rules={{ required: "Please describe the professor and course" }}
        />
        <TextAreaInput
          label="Workload"
          name="workload"
          rows={8}
          rules={{ required: "Please describe the workload" }}
        />
        <RadioInputGroup labels={evaluationLabels} name="evaluation" />
        <SubmitConfirm
          content={confirmContent}
          header="Are you sure you want to submit this review?"
        />
      </Form>
    </>
  );
}
