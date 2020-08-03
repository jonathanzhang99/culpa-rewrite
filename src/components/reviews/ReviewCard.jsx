import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Container, Header, Image, Grid } from "semantic-ui-react";

import { CourseDisplayName } from "components/common/CourseDisplay"
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";
import downvoteClickedIcon from "icons/blue-downvote.png"
import upvoteClickedIcon from "icons/blue-upvote.png"
import downvoteIcon from "icons/downvote.png"
import funnyIcon from "icons/funny.png"
import upvoteIcon from "icons/upvote.png"

function VotesContainer({reviewId, upvotes, downvotes, funnys}){
    const [upvoteClicked, setUpvoteClicked] = useState(false)
    const [downvoteClicked, setDownvoteClicked] = useState(false)
    const [funnyClicked, setFunnyClicked] = useState(false)

    const [upvoteCount, setUpvoteCount] = useState(upvotes)
    const [downvoteCount, setDownvoteCount] = useState(downvotes)
    const [funnyCount, setFunnyCount] = useState(funnys)

    useEffect(() => {
        setUpvoteCount(upvotes)
    }, [upvotes])

    useEffect(() => {
        setDownvoteCount(downvotes)
    }, [downvotes])

    useEffect(() => {
        setFunnyCount(funnys)
    }, [funnys])

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
                return res.error;
            };
        } catch(err){
            return err
        };

        return null
    }
    function toggleUpvote(){
        if (upvoteClicked) {setUpvoteCount(upvoteCount - 1)} else {setUpvoteCount(upvoteCount + 1)}
        changeVoteCount('upvote', upvoteClicked ? 'revoke': 'add')
        setUpvoteClicked(!upvoteClicked)
    }

    function toggleDownvote(){
        if (downvoteClicked) {setDownvoteCount(downvoteCount - 1)} else {setDownvoteCount(downvoteCount + 1)}
        changeVoteCount('downvote', downvoteClicked ? 'revoke': 'add')
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
    reviewId: PropTypes.string.isRequired
}

VotesContainer.propTypes = votesContainerPropTypes

export default function ReviewCard({onlyProf, onlyCourse, submissionDate, reviewId, 
                                    upvotes, downvotes, funnys, 
                                    profFirstName, profLastName, courseCode, courseName,
                                    content}){
    return (
        <Container fluid>
            <Grid>
            <Grid.Column key={1} style={{backgroundColor:"#F2F2F2", 
                                                    padding: "30px"}} width={14}>
                <Container fluid>
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
                <VotesContainer downvotes={downvotes} funnys={funnys} reviewId={reviewId} upvotes={upvotes} />
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
