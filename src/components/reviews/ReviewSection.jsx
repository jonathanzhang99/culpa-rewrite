import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react"
import { Button } from "semantic-ui-react"

import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";

export default function ReviewSection({initReviews, pageTypeProp, idProp, assocList}){
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
        pageType: pageTypeProp,
        id: idProp,
        sorting: '',
        filters: {
            assocListLimit: [],
            yearLimit: null,
            voteType: ''
        }
    })

    const fetchReviews = async () => {
        dispatch({type: 'FETCH_START'})
        const res = await fetch(`/api/review/get?type=${state.pageType}&${state.pageType}Id=${state.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sorting: state.sorting,
                filterList: state.filters.assocListLimit,
                filterYearLimit: state.filters.yearLimit,
                filterVoteType: state.filters.voteType
            })
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
        } else {
            console.log(state.reviews)
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
            id: PropTypes.number.isRequired,
            content: PropTypes.string.isRequired,
            workload: PropTypes.string.isRequired,
            rating: PropTypes.number.isRequired,
            submissionDate: PropTypes.string.isRequired,
            upvotes: PropTypes.number.isRequired,
            downvotes: PropTypes.number.isRequired,
            funnys: PropTypes.number.isRequired,
            upvoteClicked: PropTypes.bool.isRequired,
            downvoteClicked: PropTypes.bool.isRequired,
            funnyClicked: PropTypes.bool.isRequired,
            deprecated: PropTypes.bool.isRequired
        })
    ).isRequired,
    pageTypeProp: PropTypes.string.isRequired,
    idProp: PropTypes.number.isRequired,
    assocList: PropTypes.arrayOf(
        PropTypes.number
    ).isRequired
}

ReviewSection.propTypes = propTypes