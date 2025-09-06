import { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { alpha } from '@mui/material/styles';
import { DataGrid, GridToolbarFilterButton } from '@mui/x-data-grid';
import { addFavorite, removeFavorite, selectFavorites } from '../store/Reducer/favoritesReducer';

export default function UserTable({ users }) {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  const favoriteIds = useMemo(() => new Set(favorites.map((u) => u.id)), [favorites]);

  const toggleFavorite = useCallback((user) => {
    if (favoriteIds.has(user.id)) dispatch(removeFavorite(user.id));
    else dispatch(addFavorite(user));
  }, [dispatch, favoriteIds]);

  const columns = useMemo(() => [
    {
      field: 'favorite',
      headerName: 'Favorite',
      width: 120,
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const u = params.row;
        const isFav = favoriteIds.has(u.id);
        return (
          <Tooltip title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              size="small"
              aria-label={isFav ? 'Unfavorite' : 'Favorite'}
              onClick={(e) => { e.stopPropagation(); toggleFavorite(u); }}
              sx={(theme) => ({
                borderRadius: 2,
                color: isFav ? theme.palette.error.main : theme.palette.text.secondary,
                bgcolor: isFav ? alpha(theme.palette.error.main, 0.15) : 'transparent',
                '&:hover': {
                  bgcolor: isFav ? alpha(theme.palette.error.main, 0.25) : theme.palette.action.hover,
                },
              })}
            >
              {isFav ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      field: 'avatar',
      headerName: 'Photo',
      width: 90,
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Avatar src={params.row.avatar_url} alt={params.row.login} sx={{ width: 40, height: 40 }} />
        </Box>
      ),
    },
    {
      field: 'login',
      headerName: 'User',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack spacing={0.25}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.row.login}</Typography>
          <Typography variant="caption" color="text.secondary">@{params.row.login}</Typography>
        </Stack>
      ),
    },
    {
      field: 'html_url',
      headerName: 'GitHub',
      flex: 1,
      minWidth: 200,
      sortable: true,
      sortComparator: (a, b) => String(a || '').localeCompare(String(b || ''), undefined, { sensitivity: 'base' }),
      renderCell: (params) => (
        <Tooltip title="Open profile on GitHub">
          <Box
            component="a"
            href={params.value}
            target="_blank"
            rel="noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.6,
              borderRadius: 999,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: (t) => t.palette.mode === 'light' ? 'grey.50' : 'grey.800',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: (t) => t.palette.mode === 'light' ? 'grey.100' : 'grey.700',
              },
            }}
          >
            <GitHubIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
              github.com/{params.row.login}
            </Typography>
            <OpenInNewIcon fontSize="inherit" sx={{ opacity: 0.7 }} />
          </Box>
        </Tooltip>
      ),
    },

  ], [favoriteIds, toggleFavorite]);

  const rows = users;

  function FilterToolbar() {
    return (
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <GridToolbarFilterButton />
      </Box>
    );
  }

  return (
    <Paper sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        hideFooter
        rowHeight={56}
        headerHeight={48}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
        slots={{ toolbar: FilterToolbar }}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: (t) => (t.palette.mode === 'light' ? 'grey.50' : 'grey.900'),
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            py: 1.25,
            px: 2.5,
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: 0.2,
            color: 'text.primary',
          },
          '& .MuiDataGrid-cell': {
            px: 2.5,
            pt: 1.25,
            pb: 1.25,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-cell.MuiDataGrid-cell--textLeft': {
            pt: 1.25,
            pb: 1.25,
          },
          '& .MuiDataGrid-cellContent': {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }}
        rowBuffer={5}
        columnBuffer={2}
      />
    </Paper>
  );
}
