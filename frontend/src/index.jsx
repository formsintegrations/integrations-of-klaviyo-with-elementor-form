/* eslint-disable no-undef */
import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { AllFormContextProvider } from './Utils/AllFormContext'
import Loader from './components/Loaders/Loader'

const App = lazy(() => import('./App'))

ReactDOM.render(
  <AllFormContextProvider>
    <Suspense
      fallback={(
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '82vh',
          }}
        />
      )}
    >
      <App />
    </Suspense>
  </AllFormContextProvider>,
  document.getElementById('btcd-app'),
)

// serviceWorker.register();
