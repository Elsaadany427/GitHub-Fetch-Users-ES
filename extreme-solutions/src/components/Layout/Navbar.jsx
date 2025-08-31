import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Badge,
    IconButton,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Home as HomeIcon,
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Navbar() {
    const location = useLocation();
    const favorites = useSelector(state => state.favorites);

    return (
        <AppBar position="static" elevation={2}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    GitHub Users
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        startIcon={<HomeIcon />}
                        variant={location.pathname === '/' ? 'outlined' : 'text'}
                    >
                        Home
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/favorites"
                        startIcon={
                            <Badge badgeContent={favorites.length} color="secondary">
                                <FavoriteIcon />
                            </Badge>
                        }
                        variant={location.pathname === '/favorites' ? 'outlined' : 'text'}
                    >
                        Favorites
                    </Button>

                </Box>
            </Toolbar>
        </AppBar>
    );
}