import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ArticlePage from './pages/ArticlePage';
import NewArticle from './pages/NewArticle';
import EditArticle from './pages/EditArticle';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <UserProvider>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />

      <Route
        path="/new-article"
        element={<ProtectedRoute element={<NewArticle />} />}
      />
      <Route
        path="/edit/:slug"
        element={<ProtectedRoute element={<EditArticle />} />}
      />
    </Routes>
  </UserProvider>
);

export default App;