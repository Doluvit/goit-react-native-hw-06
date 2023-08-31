import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PostsScreen from "../screens/PostsScreen";
import CreatePostsScreen from "../screens/CreatePostsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { View, StyleSheet } from "react-native";
import { IconMenu, IconAdd, IconUser } from "../assets/icons/icons";
import { LogOutButton } from "./LogOutButton";
import { GoBackButton } from "./GoBackButton";

const Tabs = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Posts"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === "Posts") {
            return (
              <View style={focused ? styles.focusedIcon : styles.bluredIcon}>
                <IconMenu stroke={focused ? "#fff" : "#000"} />
              </View>
            );
          } else if (route.name === "CreatePosts") {
            return (
              <View style={styles.bluredIcon}>
                <IconAdd fill={"#000"} />
              </View>
            );
          } else if (route.name === "Profile") {
            return (
              <View style={focused ? styles.focusedIcon : styles.bluredIcon}>
                <IconUser stroke={focused ? "#fff" : "#000"} />
              </View>
            );
          }
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 83,
          paddingTop: 9,
          paddingLeft: 82,
          paddingRight: 82,
          justifyContent: "center",
          alignItems: "center",
        },
        headerShown: true,
        headerStyle: {
          borderBottomWidth: 1,
        },
      })}
    >
      <Tabs.Screen
        name={"Posts"}
        component={PostsScreen}
        options={{
          title: "Публікації",
          headerRight: () => <LogOutButton />,
          headerStyle: {
            borderBottomWidth: 1,
          },
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name={"CreatePosts"}
        component={CreatePostsScreen}
        options={{
          title: "Створити публікацію",
          tabBarStyle: { display: "none" },
          headerLeft: () => <GoBackButton />,
          headerStyle: {
            borderBottomWidth: 1,
          },
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name={"Profile"}
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bluredIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  focusedIcon: {
    backgroundColor: "#FF6C00",
    width: 70,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomTabNavigator;
