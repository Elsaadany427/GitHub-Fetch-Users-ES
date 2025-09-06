import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Badge,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Home as HomeIcon,
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFavorites } from '../../store/Reducer/favoritesReducer';

export default function Navbar({ darkMode, toggleDarkMode }) {
    const location = useLocation();
    const favorites = useSelector(selectFavorites);
    const favCount = favorites.length;

    return (
        <AppBar position="static" elevation={2}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    GitHub Users
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Full buttons on sm+ */}
                    <Box sx={{ display: { xs: 'none', sm: 'inline-flex' }, alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/"
                            startIcon={<HomeIcon />}
                            size="small"
                            variant={location.pathname === '/' ? 'outlined' : 'text'}
                        >
                            Home
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/favorites"
                            startIcon={
                                <Badge badgeContent={favCount} color="secondary" overlap="circular">
                                    <FavoriteIcon />
                                </Badge>
                            }
                            size="small"
                            variant={location.pathname === '/favorites' ? 'outlined' : 'text'}
                        >
                            Favorites
                        </Button>
                    </Box>

                    {/* Compact icons on xs */}
                    <Box sx={{ display: { xs: 'inline-flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Home">
                            <IconButton color="inherit" component={Link} to="/" aria-label="Home">
                                <HomeIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Favorites">
                            <IconButton color="inherit" component={Link} to="/favorites" aria-label="Favorites">
                                <Badge badgeContent={favCount} color="secondary" overlap="circular">
                                    <FavoriteIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Tooltip title={darkMode ? 'Switch to light' : 'Switch to dark'}>
                        <IconButton color="inherit" onClick={toggleDarkMode} aria-label="Toggle theme">
                            {darkMode ? <LightIcon /> : <DarkIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
