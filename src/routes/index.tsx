import { Route, Routes } from 'react-router-dom'

import Main from './Main'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
    </Routes>
  )
}

export default App
