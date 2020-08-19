import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react"
import { Button } from "semantic-ui-react"

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";

export default function ReviewSection({initReviews, pageType, id, assocList}){
    const reducer = (state, action) => {
        switch(action.type){
            case "RELOAD_START":
                return {
                    ...state,
                    reload: true
                };
            case "RELOAD_END":
                return {
                    ...state,
                    reload: false
                };
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
                    sorting: action.payload.sorting
                };
            default:
                throw new Error()
        }
    }
    const [state, dispatch] = useReducer(reducer, {
        reload: false,
        isLoading: false,
        isError: false,
        reviews: initReviews,
        pageType,
        id,
        sorting: '',
        filters: {
            assocListLimit: [],
            year: null,
            voteType: ''
        }
    })

    const fetchReviews = async () => {
        dispatch({type: 'FETCH_START'})
        const filterList = state.filters.assocListLimit.join(',')
        const res = await fetch(
            `/api/review/get/${state.pageType}/${state.id}`
            + `?sorting=${state.sorting}`
            + `&filter_list=${filterList}`
            + `&filter_year=${state.filters.year}`, 
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

    useEffect(() => {
        if(state.reload){
            fetchReviews()
            dispatch({type: "RELOAD_END"})
        }
    })

    if (state.isLoading || state.isError) {
        return state.isLoading ? <LoadingComponent /> : <ErrorComponent />;
    }

    return (
        <div>
            <p>placeholder for review section</p>
            <Button onClick={() =>{
                dispatch({type: "RELOAD_START"})
                dispatch({
                    type: "CHANGE_SORTING",
                    payload: {
                        sorting: "oldest",
                        assocList // put here only to avoid lint errors
                    }
                })
            }}>Change sorting to oldest button (for testing)</Button>
        </div>
    )
}

const propTypes = {
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
    assocList: PropTypes.arrayOf(
        PropTypes.number
    ).isRequired
}

ReviewSection.propTypes = propTypes