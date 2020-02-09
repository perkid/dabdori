import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Main from '../screens/Main';
import MyPage from '../screens/MyPage';
import Order from '../screens/Order';
import Login from '../screens/Login';
import ResetPassword from '../screens/ResetPassword';
import PasswordChange from '../screens/PasswordChange'

const AppStack = createStackNavigator(
  {
    Main: {
      screen: Main
    },
    MyPage: {
      screen: MyPage
    },
    Order: {
      screen: Order
    },
    PasswordChange: {
      screen: PasswordChange
    }
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    mode: 'modal'
  }
);

const AuthStack = createStackNavigator(
  {
    Auth: {
      screen: Login
    },
    ResetPassword:{
      screen: ResetPassword
    }
  },
  {
    initialRouteName: 'Auth',
    headerMode: 'none',
  }
);

export default createAppContainer(createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  },
  {
    initialRouteName: 'App'
  }
));