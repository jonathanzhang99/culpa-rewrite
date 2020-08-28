import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react"
import { Container, Dropdown, Grid, Button, Icon } from "semantic-ui-react"

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import ReviewCard from "components/reviews/ReviewCard"

const propTypesReviewSection = {
  initReviews: PropTypes.arrayOf(
    PropTypes.shape({
      reviewType: PropTypes.oneOf(['professor', 'course']).isRequired,
      reviewHeader: PropTypes.oneOfType([
        PropTypes.shape({
          courseId: PropTypes.number.isRequired,
          courseName: PropTypes.string.isRequired,
          courseCode: PropTypes.string.isRequired,
        }),
        PropTypes.shape({
          profId: PropTypes.number.isRequired,
          profFirstName: PropTypes.string.isRequired,
          profLastName: PropTypes.string.isRequired,
          uni: PropTypes.string.isRequired
        }),
      ]).isRequired,
      votes: PropTypes.shape({
        initUpvoteCount: PropTypes.number.isRequired,
        initDownvoteCount: PropTypes.number.isRequired,
        initFunnyCount: PropTypes.number.isRequired,
        upvoteClicked: PropTypes.bool.isRequired,
        downvoteClicked: PropTypes.bool.isRequired,
        funnyClicked: PropTypes.bool.isRequired,
      }).isRequired,
      workload: PropTypes.string,
      submissionDate: PropTypes.string.isRequired,
      reviewId: PropTypes.number.isRequired,
      deprecated: PropTypes.bool,
      content: PropTypes.string,
    })
  ).isRequired,
  pageType: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  associatedEntities: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        professorId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
      }),
      PropTypes.shape({
        courseId: PropTypes.number.isRequired,
        courseCode: PropTypes.string.isRequired,
        courseName: PropTypes.string.isRequired
      })
    ])
  ).isRequired
}

export default function ReviewSection({initReviews, pageType, id, associatedEntities}){
  const NUM_REVIEWS_PER_PAGE = 5
  const reducer = (state, action) => {
    switch(action.type){
      case "FETCH_START":
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          reviews: action.payload.reviews
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        }
      case "CHANGE_SORTING":
        return {
          ...state,
          pageNumber: 1,
          sorting: action.payload.sorting
        };
      case "CHANGE_FILTER_YEAR":
        return {
          ...state,
          pageNumber: 1,
          filters: {
            associatedEntitiesFilter: state.filters.associatedEntitiesFilter,
            year: action.payload.filterYear,
            yearText: action.payload.filterYearText
          }
        }
      case "CHANGE_FILTER_ASSOC_LIST":
        return {
          ...state,
          pageNumber: 1,
          filters: {
            ...state.filters,
            associatedEntitiesFilter: action.payload.associatedEntitiesFilter
          }
        }
      case "INCREMENT_PAGE_NUMBER":
        return {
          ...state,
          pageNumber: state.pageNumber + 1
        }
      default:
        throw new Error()
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    reviews: initReviews,
    associatedEntities,
    pageNumber: 1,
    pageType,
    id,
    sorting: '',
    filters: {
      associatedEntitiesFilter: [],
      year: '',
      yearText: '',
    }
  })

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch({type: 'FETCH_START'})
      const filterList = state.filters.associatedEntitiesFilter.join(',')
      const res = await fetch(
        `/api/review/get/${state.pageType}/${state.id}` +
        `?sorting=${state.sorting}` +
        `&filterList=${filterList}` +
        `&filterYear=${state.filters.year}`, 
        {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
        },
      })
      try {
        const result = await res.json()
        if (!res.ok){
          dispatch({type: "FETCH_FAILURE", payload: result.error})
        } else {
          dispatch({type: "FETCH_SUCCESS", payload: result})
        }
        return result
      } catch(error){
        dispatch({type: "FETCH_FAILURE", payload: error})
        return {'error': error}
      }
    }    
    fetchReviews()
  }, [state.id, state.pageType, state.sorting, state.filters])

  const sortingOptions = [
    {key: 0, text: 'None', value: ''},
    {key: 1, text: 'Most Positive', value: 'most_positive'},
    {key: 2, text: 'Most Negative', value: 'most_negative'},
    {key: 3, text: 'Newest', value: 'newest'},
    {key: 4, text: 'Oldest', value: 'oldest'},
    {key: 5, text: 'Most Agreed', value: 'most_agreed'},
    {key: 6, text: 'Most Disagreed', value: 'most_disagreed'}
  ]

  const yearOptions = [
    {key: 0, text: 'None', value: ''},
    {key: 1, text: 'Written within 2 years', value: 2},
    {key: 2, text: 'Written within 5 years', value: 5}
  ]

  const associatedEntitiesFilterOptions = state.associatedEntities.map((item) => {
    const otherType = state.pageType === 'professor' ? 'course' : 'professor'
    return ({
      key: item[`${otherType}Id`],
      value: item[`${otherType}Id`],
      text: otherType === 'professor' ? 
        `${item.firstName} ${item.lastName}` :
        `[${item.courseCode}] ${item.courseName}`
    })
  })

  const onSortChange = (e, data) => {
    dispatch({type: 'CHANGE_SORTING', payload: {sorting: data.value}})
  }

  const onFilterYearChange = (e, data) => {
    dispatch({type: 'CHANGE_FILTER_YEAR', payload: {
      filterYear: data.value,
      filterYearText: data.text
    }})
  }

  const onFilterAssociatedEntitiesChange = (e, data) => {
    dispatch({
      type: "CHANGE_FILTER_ASSOC_LIST",
      payload: {
        associatedEntitiesFilter: data.value
      }
    })
  }

  const onClickPagButton = () => {
    dispatch({type: "INCREMENT_PAGE_NUMBER"})
  }

  if (state.isLoading || state.isError) {
    return state.isLoading ? <LoadingComponent /> : <ErrorComponent />;
  }

  return (
    <Container fluid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Dropdown 
              fluid
              selection
              name="sorting"
              options={sortingOptions}
              placeholder="Sort by"
              text={state.sorting}
              value={state.sorting}
              onChange={onSortChange}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Dropdown 
              fluid
              selection
              name="yearFilter"
              options={yearOptions}
              placeholder="Filter by"
              text={state.filters.yearText}
              value={state.filters.year}
              onChange={onFilterYearChange}
            />
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={7}>
            <Dropdown
              fluid
              multiple
              search
              selection
              name="associatedEntityFilter"
              options={associatedEntitiesFilterOptions}
              placeholder={state.pageType === 'professor' ?
                'Search for a specific course' : 
                'Search for a specific professor'
              }
              value={state.filters.associatedEntitiesFilter}
              onChange={onFilterAssociatedEntitiesChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {state.reviews.slice(
            0, state.pageNumber * NUM_REVIEWS_PER_PAGE
          ).map((review) => {return (
            <ReviewCard 
              content={review.content}
              deprecated={review.deprecated}
              key={review.reviewId}
              reviewHeader={review.reviewHeader}
              reviewId={review.reviewId}
              reviewType={review.reviewType}
              submissionDate={review.submissionDate}
              votes={review.votes}
              workload={review.workload}
            />
          )})}
        </Grid.Row>
        <Grid.Row centered key={3} style={{marginBottom: '50px'}}>
          <Button 
            fluid 
            name="showMoreButton" 
            size="large"
            onClick={onClickPagButton}
          >
            Show more<Icon name="arrow down" style={{marginLeft: '5px'}}/>
          </Button>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

ReviewSection.propTypes = propTypesReviewSection
