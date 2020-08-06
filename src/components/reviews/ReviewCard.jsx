import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Container, Header, Image, Grid, Message, Icon } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay"
import ErrorComponent from "components/common/ErrorComponent";
import LoadingComponent from "components/common/LoadingComponent";
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import useDataFetch from "components/common/useDataFetch";
import downvoteClickedIcon from "icons/blue-downvote.png"
import upvoteClickedIcon from "icons/blue-upvote.png"
import downvoteIcon from "icons/downvote.png"
import funnyIcon from "icons/funny.png"
import upvoteIcon from "icons/upvote.png"

function VotesContainer({reviewId, upvotes, downvotes, funnys,
                         upvoteClickedProp, downvoteClickedProp, funnyClickedProp}){

    const [upvoteClicked, setUpvoteClicked] = useState(upvoteClickedProp)
    const [downvoteClicked, setDownvoteClicked] = useState(downvoteClickedProp)
    const [funnyClicked, setFunnyClicked] = useState(funnyClickedProp)

    const [upvoteCount, setUpvoteCount] = useState(upvotes)
    const [downvoteCount, setDownvoteCount] = useState(downvotes)
    const [funnyCount, setFunnyCount] = useState(funnys)

    useEffect(() => {
        setUpvoteClicked(upvoteClickedProp)
        setDownvoteClicked(downvoteClickedProp)
        setFunnyClicked(funnyClickedProp)
    }, [upvoteClickedProp, downvoteClickedProp, funnyClickedProp])

    // update vote counts when the vote counts fetched from the db has changed
    useEffect(() => {
        setUpvoteCount(upvotes)
    }, [upvotes])

    useEffect(() => {
        setDownvoteCount(downvotes)
    }, [downvotes])

    useEffect(() => {
        setFunnyCount(funnys)
    }, [funnys])

    // function for adding / revoking a vote for a review
    const changeVoteCount = async (voteType, action) => {
        const req = await fetch("/api/votes/change", {
            method: "POST",
            body: JSON.stringify({
                action,
                voteType,
                reviewId
            }),
            headers: {
              "Content-Type": "application/json",
            }
        });
        try {
            const res = await req.json()
            if (res.error){
                return res;
            };
        } catch(err){
            return err
        };
    }

    // update state values and send post req to backend when user votes/un-votes
    function toggleUpvote(){
        if (upvoteClicked) {setUpvoteCount(upvoteCount - 1)} else {setUpvoteCount(upvoteCount + 1)}
        changeVoteCount('agree', upvoteClicked ? 'revoke': 'add')
        setUpvoteClicked(!upvoteClicked)
    }

    function toggleDownvote(){
        if (downvoteClicked) {setDownvoteCount(downvoteCount - 1)} else {setDownvoteCount(downvoteCount + 1)}
        changeVoteCount('disagree', downvoteClicked ? 'revoke': 'add')
        setDownvoteClicked(!downvoteClicked)
    }

    function toggleFunny(){
        if (funnyClicked) {setFunnyCount(funnyCount - 1)} else {setFunnyCount(funnyCount + 1)}
        changeVoteCount('funny', funnyClicked ? 'revoke': 'add')
        setFunnyClicked(!funnyClicked)
    }

    return (
        <Container>
            <Grid centered style={{padding: "30px 10px", 
                                   height: "100%"}}>
                <Grid.Row style={{paddingBottom:0, overflow: "show"}}>
                    <Image src={upvoteClicked ? upvoteClickedIcon : upvoteIcon} onClick={toggleUpvote} />
                </Grid.Row>
                <Grid.Row style={{padding:0, color:"white"}}>
                    <strong>{upvoteCount}</strong>
                </Grid.Row>
                <Grid.Row style={{paddingBottom:0}}>
                    <Image src={downvoteClicked? downvoteClickedIcon : downvoteIcon} onClick={toggleDownvote} />
                </Grid.Row>
                <Grid.Row style={{padding:0, color:"white"}}>
                    <strong>{downvoteCount}</strong>
                </Grid.Row>
                <Grid.Row style={{paddingBottom:0}}>
                    <Image src={funnyIcon} onClick={toggleFunny} />
                </Grid.Row>
                <Grid.Row style={{padding:0, color:"white"}}>
                    <strong>{funnyCount}</strong>
                </Grid.Row>
            </Grid> 
        </Container>
    )
}

const votesContainerPropTypes = {
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    funnys: PropTypes.number.isRequired,
    reviewId: PropTypes.string.isRequired,
    upvoteClickedProp: PropTypes.bool,
    downvoteClickedProp: PropTypes.bool,
    funnyClickedProp: PropTypes.bool
}

const votesContainerDefaultProps = {
    upvoteClickedProp: false,
    downvoteClickedProp: false,
    funnyClickedProp: false
}

VotesContainer.propTypes = votesContainerPropTypes
VotesContainer.defaultProps = votesContainerDefaultProps

export default function ReviewCard({onlyProf, onlyCourse, submissionDate, reviewId, 
                                    upvotes, downvotes, funnys, 
                                    profFirstName, profLastName, courseCode, courseName,
                                    content}){
    
    // get clicked state of each button for this specific user
    const {
        data: { upvoteClicked, downvoteClicked, funnyClicked },
        isLoading,
        isError,
    } = useDataFetch(`/api/votes/get_clicked_state?reviewId=${reviewId}`, {
        upvoteClicked: false,
        downvoteClicked: false,
        funnyClicked: false
    });

    if (isLoading || isError) {
        return isLoading ? <LoadingComponent /> : <ErrorComponent />;
    }

    const deprecated = Math.floor((new Date() - new Date(submissionDate)) / (3600 * 24 * 365)) > 5
    return (
        <Container fluid>
            <Grid>
            <Grid.Column key={1} style={{backgroundColor:"#F2F2F2", 
                                                    padding: "30px"}} width={14}>
                <Container fluid>
                    {deprecated && <Message style={{backgroundColor:"#FFF1F1"}}>
                        <Icon color="red" name="warning circle" />Please keep in mind that this review is more than 5 years old.
                    </Message>}
                    <div style={{position:"relative"}}>
                        {!onlyProf && <ProfessorDisplayName as="h3" firstName={profFirstName} lastName={profLastName} />}
                        {!onlyCourse && <CourseDisplayName as="h3" code={courseCode} name={courseName} />}
                        <Header as="h5">{submissionDate}</Header>
                        <div style={{position: "absolute", 
                                    top: 0, 
                                    right: 0,
                                    fontSize: "16px"}}>ID: {reviewId}</div>
                    </div>           
                    <p>{content}</p>
                </Container>
            </Grid.Column>
            <Grid.Column key={2} style={{backgroundColor: "#004E8D", paddingLeft: 0}}  width={2}>
                <VotesContainer downvoteClickedProp={downvoteClicked} downvotes={downvotes} funnyClickedProp={funnyClicked} funnys={funnys} 
                                reviewId={reviewId} 
                                upvoteClickedProp={upvoteClicked} 
                                upvotes={upvotes} />
            </Grid.Column>
            </Grid>
        </Container>
    )
}

const reviewCardPropTypes = {
    onlyProf: PropTypes.bool.isRequired,
    onlyCourse: PropTypes.bool.isRequired,
    submissionDate: PropTypes.string.isRequired,
    reviewId: PropTypes.string.isRequired,
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    funnys: PropTypes.number.isRequired,
    profFirstName: PropTypes.string.isRequired,
    profLastName: PropTypes.string.isRequired,
    courseCode: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
}

ReviewCard.propTypes = reviewCardPropTypes
