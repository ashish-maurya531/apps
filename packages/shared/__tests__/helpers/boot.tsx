// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { WidenPrimitives } from '@growthbook/growthbook';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactElement, ReactNode } from 'react';

import { FeaturesReadyContext } from '../../src/components/GrowthBookProvider';
import { LazyModalElement } from '../../src/components/modals/LazyModalElement';
import {
  AlertContextProvider,
  AlertContextProviderProps,
} from '../../src/contexts/AlertContext';
import AuthContext, { AuthContextData } from '../../src/contexts/AuthContext';
import LogContext from '../../src/contexts/LogContext';
import {
  NotificationsContextProvider,
  NotificationsContextProviderProps,
} from '../../src/contexts/NotificationsContext';
import OnboardingContext from '../../src/contexts/OnboardingContext';
import SettingsContext, {
  SettingsContextData,
  ThemeMode,
} from '../../src/contexts/SettingsContext';
import { OnboardingMode } from '../../src/graphql/feed';
import { LogContextData } from '../../src/hooks/log/useLogContextData';
import { ChecklistViewState } from '../../src/lib/checklist';

interface TestBootProviderProps {
  children: ReactNode;
  client: QueryClient;
  settings?: Partial<SettingsContextData>;
  auth?: Partial<AuthContextData>;
  alerts?: Partial<AlertContextProviderProps>;
  notification?: Partial<NotificationsContextProviderProps>;
  log?: Partial<LogContextData>;
  gb?: GrowthBook;
}

export const settingsContext: SettingsContextData = {
  autoDismissNotifications: true,
  companionExpanded: true,
  insaneMode: false,
  loadedSettings: true,
  onToggleHeaderPlacement: jest.fn(),
  onboardingChecklistView: ChecklistViewState.Hidden,
  openNewTab: true,
  optOutCompanion: false,
  optOutReadingStreak: true,
  setOnboardingChecklistView: jest.fn(),
  setSettings: jest.fn(),
  setSpaciness: jest.fn(),
  setTheme: jest.fn(),
  showTopSites: true,
  sidebarExpanded: true,
  sortingEnabled: false,
  spaciness: 'eco',
  syncSettings: jest.fn(),
  themeMode: ThemeMode.Dark,
  toggleAutoDismissNotifications: jest.fn(),
  toggleInsaneMode: jest.fn(),
  toggleOpenNewTab: jest.fn(),
  toggleOptOutCompanion: jest.fn(),
  toggleOptOutReadingStreak: jest.fn(),
  toggleShowTopSites: jest.fn(),
  toggleSidebarExpanded: jest.fn(),
  toggleSortingEnabled: jest.fn(),
  updateCustomLinks: jest.fn(),
};

export const defaultLogContextData: LogContextData = {
  logEvent: jest.fn(),
  logEventStart: jest.fn(),
  logEventEnd: jest.fn(),
  sendBeacon: jest.fn(),
};

export const TestBootProvider = ({
  client,
  children,
  settings = {},
  auth = {},
  alerts = {},
  notification = {},
  log = {},
  gb = new GrowthBook(),
}: TestBootProviderProps): ReactElement => {
  return (
    <QueryClientProvider client={client}>
      <AlertContextProvider loadedAlerts {...alerts}>
        <AuthContext.Provider
          value={{
            shouldShowLogin: false,
            logout: jest.fn(),
            updateUser: jest.fn(),
            tokenRefreshed: true,
            getRedirectUri: jest.fn(),
            isFetched: true,
            isLoggedIn: true,
            showLogin: jest.fn(),
            closeLogin: jest.fn(),
            ...auth,
          }}
        >
          <GrowthBookProvider growthbook={gb}>
            <FeaturesReadyContext.Provider
              value={{
                ready: true,
                getFeatureValue<T>(feature) {
                  return feature.defaultValue as WidenPrimitives<T>;
                },
              }}
            >
              <SettingsContext.Provider
                value={{
                  ...settingsContext,
                  ...settings,
                }}
              >
                <LogContext.Provider
                  value={{ ...defaultLogContextData, ...log }}
                >
                  <OnboardingContext.Provider
                    value={{
                      myFeedMode: OnboardingMode.Manual,
                      isOnboardingOpen: false,
                      onCloseOnboardingModal: jest.fn(),
                      onInitializeOnboarding: jest.fn(),
                      onShouldUpdateFilters: jest.fn(),
                      onStartArticleOnboarding: jest.fn(),
                      shouldSkipIntro: false,
                    }}
                  >
                    <NotificationsContextProvider {...notification}>
                      {children}
                      <LazyModalElement />
                    </NotificationsContextProvider>
                  </OnboardingContext.Provider>
                </LogContext.Provider>
              </SettingsContext.Provider>
            </FeaturesReadyContext.Provider>
          </GrowthBookProvider>
        </AuthContext.Provider>
      </AlertContextProvider>
    </QueryClientProvider>
  );
};
