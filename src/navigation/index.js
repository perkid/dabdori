import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Main from '../screens/Main';
import MyPage from '../screens/MyPage';
import OrderHistory from '../screens/OrderHistory';
import Login from '../screens/Login';
import ResetPassword from '../screens/ResetPassword';
import PasswordChange from '../screens/PasswordChange';
import OrderDetail from '../screens/OrderDetail';
import Cart from '../screens/Cart';

const AppStack = createStackNavigator(
  {
    Main: {
      screen: Main
    },
    MyPage: {
      screen: MyPage
    },
    OrderHistory: {
      screen: OrderHistory
    },
    OrderDetail:{
      screen: OrderDetail
    },
    PasswordChange: {
      screen: PasswordChange
    },
    Cart: {
      screen: Cart
    },
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
    initialRouteName: 'Auth'
  }
));

