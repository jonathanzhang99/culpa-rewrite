import PropTypes from "prop-types";
import React, { useState } from "react";
import { Container, Header, Image, Grid } from "semantic-ui-react";
import { CourseDisplayName } from "components/common/CourseDisplay"
import { ProfessorDisplayName } from "components/common/ProfessorDisplay";

import downvote_icon from "icons/downvote.png"
import upvote_icon from "icons/upvote.png"
import funny_icon from "icons/funny.png"

const propTypes = {
    isProp: PropTypes.bool.isRequired,
    isCourse: PropTypes.bool.isRequired,
    submission_date: PropTypes.string.isRequired
}

ReviewCard.propTypes = propTypes

function VotesContainer({upvotes, downvotes, funnys}){
    const [upvoteClicked, setUpvoteClicked] = useState(false)
    const [downvoteClicked, setDownvoteClicked] = useState(false)
    const [funnyClicked, setFunnyClicked] = useState(false)

    const [upvoteCount, setUpvoteCount] = useState(upvotes)
    const [downvoteCount, setDownvoteCount] = useState(downvotes)
    const [funnyCount, setFunnyCount] = useState(funnys)

    function toggleUpvote(){
        upvoteClicked ? setUpvoteCount(upvoteCount - 1) : setUpvoteCount(upvoteCount + 1)
        setUpvoteClicked(!upvoteClicked)
    }

    function toggleDownvote(){
        downvoteClicked ? setDownvoteCount(downvoteCount - 1) : setDownvoteCount(downvoteCount + 1)
        setDownvoteClicked(!downvoteClicked)
    }

    function toggleFunny(){
        funnyClicked ? setFunnyCount(funnyCount - 1) : setFunnyCount(funnyCount + 1)
        setFunnyClicked(!funnyClicked)
    }

    return (
        <Container>
            <Grid centered style={{padding: "30px 10px", 
                                   height: "100%"}}>
                <Grid.Row style={{paddingBottom:0}}>
                    <Image onClick={toggleUpvote} src={upvoteClicked ? downvote_icon : upvote_icon} />
                </Grid.Row>
                <Grid.Row style={{padding:0, color:"white"}}>
                    <strong>{upvoteCount}</strong>
                </Grid.Row>
                <Grid.Row style={{paddingBottom:0}}>
                    <Image onClick={toggleDownvote} src={downvote_icon} />
                </Grid.Row>
                <Grid.Row style={{padding:0, color:"white"}}>
                    <strong>{downvoteCount}</strong>
                </Grid.Row>
                <Grid.Row style={{paddingBottom:0}}>
                    <Image onClick={toggleFunny} src={funny_icon} />
                </Grid.Row>
                <Grid.Row style={{padding:0, color:"white"}}>
                    <strong>{funnyCount}</strong>
                </Grid.Row>
            </Grid>
            
        </Container>
    )
}
export default function ReviewCard({isProf, isCourse, submission_date, review_id, 
                                    upvotes, downvotes, funnys, 
                                    profFirstName, profLastName, courseCode, courseName,
                                    content}){
    return (
        <Container fluid>
            <Grid>
            <Grid.Column key={1} width={14} style={{backgroundColor:"#F2F2F2", 
                                                    padding: "30px"}}>
                <Container fluid>
                    <div style={{position:"relative"}}>
                        {isProf && <ProfessorDisplayName as="h3" firstName={profFirstName} lastName={profLastName}></ProfessorDisplayName>}
                        {isCourse && <CourseDisplayName as="h3" code={courseCode} name={courseName}></CourseDisplayName>}
                        <Header as="h5">{submission_date}</Header>
                        <div style={{position: "absolute", 
                                    top: 0, 
                                    right: 0,
                                    fontSize: "16px"}}>ID: {review_id}</div>
                    </div>           
                    <p>{content}</p>
                </Container>
            </Grid.Column>
            <Grid.Column key={2} width={2}  style={{backgroundColor: "#004E8D", paddingLeft: 0}}>
                <VotesContainer upvotes={upvotes} downvotes={downvotes} funnys={funnys} />
            </Grid.Column>
            </Grid>
        </Container>
    )
}