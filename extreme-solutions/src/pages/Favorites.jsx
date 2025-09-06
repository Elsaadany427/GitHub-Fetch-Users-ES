import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectFavorites } from '../store/Reducer/favoritesReducer';
import UserTable from '../components/UserTable';

export default function Favorites() {
  const favorites = useSelector(selectFavorites);

  return (
    <Container sx={{ my: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Favorites</Typography>
      {favorites.length === 0 ? (
        <Typography variant="body2">No favorites yet.</Typography>
      ) : (
        <UserTable users={favorites} />
      )}
    </Container>
  );
}
