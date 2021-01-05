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
import NoticeMain from '../screens/NoticeMain';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from 'react';
import { setRoute } from '../redux/route';
import { useDispatch } from 'react-redux';
import QNA from '../screens/QNA';

export default function dabdori(){

  const dispatch = useDispatch();
    
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
  
  const NoticeStack = createStackNavigator(
    {
      NoticeMain: {
        screen: NoticeMain
      },
      MyPage: {
        screen: MyPage
      },
      PasswordChange: {
        screen: PasswordChange
      },
      Cart: {
        screen: Cart
      },
      QNA: {
        screen: QNA
      }
    },
    {
      initialRouteName: 'NoticeMain',
      headerMode: 'none',
    }
  )

  const ChatStack = createStackNavigator(
    {
      Main: {
        screen: Main
      },
      MyPage: {
        screen: MyPage
      },
      PasswordChange: {
        screen: PasswordChange
      },
      Cart: {
        screen: Cart
      },
      QNA: {
        screen: QNA
      }
    },
    {
      initialRouteName: 'Main',
      headerMode: 'none',
      mode: 'modal'
    }
  );

  const OrderStack = createStackNavigator(
    {
      OrderHistory: {
        screen: OrderHistory
      },
      OrderDetail:{
        screen: OrderDetail
      },
      MyPage: {
        screen: MyPage
      },
      PasswordChange: {
        screen: PasswordChange
      },
      Cart: {
        screen: Cart
      },
      QNA: {
        screen: QNA
      }
    },
    {
      initialRouteName: 'OrderHistory',
      headerMode: 'none',
      mode: 'modal'
    }
  )

  const AppStack = createBottomTabNavigator({ // createMaterialTopTabNavigator 변경시 스와이프 가능
    NoticeMain: NoticeStack,
    Chat: ChatStack,
    OrderHistory: OrderStack,
  },
  {
    initialRouteName: 'NoticeMain',
    tabBarOptions: {
      style: {
        height:0
      },
      labelStyle: {
        color:'white'
      }
    },
  });

  const AppContainer = createAppContainer(createSwitchNavigator(
    {
      Auth: AuthStack,
      App: AppStack
    },
    {
      initialRouteName: 'Auth'
    }
  ));
  
  function getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  }
  
  return (
    <AppContainer
      onNavigationStateChange={(prevState, currentState, action) => {
      const currentRouteName = getActiveRouteName(currentState);
      dispatch(setRoute(currentRouteName))
      }}
    />
  )
}
