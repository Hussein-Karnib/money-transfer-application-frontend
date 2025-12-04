import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const resetToAuth = () => {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    })
  );
};

export const navigateIfNeeded = (routeName, params) => {
  if (!navigationRef.isReady() || !routeName) {
    return;
  }
  const currentRoute = navigationRef.getCurrentRoute();
  if (currentRoute?.name === routeName) {
    return;
  }
  navigationRef.navigate(routeName, params);
};

