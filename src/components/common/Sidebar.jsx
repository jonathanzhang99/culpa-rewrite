import React from 'react';
import {Link} from 'react-router-dom';
import {  Button, Header, Icon, Image, Menu, Segment, Sidebar as SemanticSidebar } from 'semantic-ui-react'

function ShowSidebarButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      Show Sidebar
    </Button>
  );
}

function HideSidebarButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      Hide Sidebar
    </Button>
  );
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleSidebarHide = this.handleSidebarHide.bind(this);
    this.state = { isVisible: false };
  }

  handleShowClick() {
    this.setState({ isVisible: true });
  }

  handleHideClick() {
    this.setState({ isVisible: false });
  }

  handleSidebarHide() {
    this.setState({ isVisible: false });
  }


  render() {
    const isVisible = this.state.isVisible;

    return (
      <div>
        {!isVisible
          ? <ShowSidebarButton onClick={this.handleShowClick}>
              Show Sidebar
            </ShowSidebarButton>
          : <HideSidebarButton onClick={this.handleHideClick}>
              Hide Sidebar
            </HideSidebarButton>
         }
        <SemanticSidebar.Pushable as={Segment}>
          <SemanticSidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={isVisible}
            width='thin'
            >
              <Menu.Item as={ Link } name='home' to='/'>
                <Icon name='home' />
                Home
              </Menu.Item>
              <Menu.Item as={ Link } name='professors' to='/professors'>
                <Icon name='address card' />
                Professors
              </Menu.Item>
              <Menu.Item as={ Link } name='review' to='/review'>
                <Icon name='edit outline' />
                Reviews
              </Menu.Item>
            </SemanticSidebar>

            <SemanticSidebar.Pusher dimmed={isVisible}>  {/* need a way to include actual content here */}
              <Segment basic>
                <Header as='h1'>Application Content</Header>
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </Segment>
            </SemanticSidebar.Pusher>
        </SemanticSidebar.Pushable>
      </div>
    );
  }
}

export default Sidebar