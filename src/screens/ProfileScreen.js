import React, { Component, PropTypes } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { ListItem } from "react-native-elements";

import ViewContainer from "../components/ViewContainer";
import UserProfile from "../components/UserProfile";
import SectionList from "../components/SectionList";
import ParallaxScroll from "../components/ParallaxScroll";
import UserListItem from "../components/UserListItem";

import config from '@config';
import Communications from "react-native-communications";

import { connect } from "react-redux";
import { getUserInfo } from "../actions/user";

const mapStateToProps = state => ({
  user: state.user.user,
  orgs: state.user.orgs,
  isPendingUser: state.user.isPendingUser,
  isPendingOrgs: state.user.isPendingOrgs
});

const mapDispatchToProps = dispatch => ({
  getUserInfo: user => dispatch(getUserInfo(user)),
});

class Profile extends Component {
  componentDidMount() {
    this.props.getUserInfo(this.props.navigation.state.params.user.login);
  }

  getUserBlog(url) {
    const prefix = 'http';
    return url.substr(0, prefix.length) === prefix ? url : `http://${url}`
  }

  render() {
    const { user, orgs, isPendingUser, isPendingOrgs, navigation } = this.props;
    const initialUser = navigation.state.params.user;
    const isPending = isPendingUser || isPendingOrgs;

    return (
      <ViewContainer barColor="light">

        <ParallaxScroll
          renderContent={() => (
            <UserProfile
              type="user"
              initialUser={initialUser}
              user={initialUser.login === user.login ? user : {}}
              navigation={navigation}
            />
          )}
          stickyTitle={user.login}
          navigateBack
          navigation={navigation}
        >

          {isPending &&
            <ActivityIndicator
              animating={isPending}
              style={{ height: 80 }}
              size="large"
            />}

          {!isPending && initialUser.login === user.login &&
            ((user.email !== null && user.email !== '') || (user.blog !== null && user.blog !== '')) &&
            <SectionList title="LINKS">
              {user.email !== null && user.email !== '' &&
                <ListItem
                  title="Email"
                  titleStyle={styles.listTitle}
                  leftIcon={{
                    name: "mail",
                    color: config.colors.grey,
                    type: "octicon"
                  }}
                  subtitle={user.email}
                  subtitleStyle={styles.listSubTitle}
                  onPress={() =>
                    Communications.email([user.email], null, null, "Hi!", "")}
                  underlayColor={config.colors.greyLight}
                />}

              {user.blog !== null && user.blog !== '' &&
                <ListItem
                  title="Website"
                  titleStyle={styles.listTitle}
                  leftIcon={{
                    name: "link",
                    color: config.colors.grey,
                    type: "octicon"
                  }}
                  subtitle={user.blog}
                  subtitleStyle={styles.listSubTitle}
                  onPress={() => Communications.web(this.getUserBlog(user.blog))}
                  underlayColor={config.colors.greyLight}
                />}
            </SectionList>}

          {!isPending && initialUser.login === user.login &&
            <SectionList 
              title="ORGANIZATIONS"
              noItems={orgs.length === 0}
              noItemsMessage={'No organizations'}>
              {orgs.map((item, i) => (
                <UserListItem key={i} user={item} navigation={navigation} />
              ))}
            </SectionList>}
          
        </ParallaxScroll>
      </ViewContainer>
    );
  }
}

Profile.propTypes = {
  getUserInfo: PropTypes.func,
  user: PropTypes.object,
  orgs: PropTypes.array,
  isPendingUser: PropTypes.bool,
  isPendingOrgs: PropTypes.bool,
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  listTitle: {
    color: config.colors.black,
    fontFamily: "AvenirNext-Medium"
  },
  listSubTitle: {
    color: config.colors.greyDark,
    fontFamily: "AvenirNext-Medium"
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
