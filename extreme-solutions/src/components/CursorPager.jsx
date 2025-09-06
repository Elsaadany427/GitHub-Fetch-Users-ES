import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function CursorPager({
  pageIndex,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onFirst,
  supportsLast = false,
  hasLast = false,
  onLast,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  if (isXs) {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ my: 1.5 }}>
        <Tooltip title="First">
          <span>
            <IconButton size="small" onClick={onFirst} disabled={!hasPrev} aria-label="First">
              <FirstPageIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Previous">
          <span>
            <IconButton size="small" onClick={onPrev} disabled={!hasPrev} aria-label="Previous">
              <NavigateBeforeIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="caption">{pageIndex}</Typography>
        <Tooltip title="Next">
          <span>
            <IconButton size="small" onClick={onNext} disabled={!hasNext} aria-label="Next">
              <NavigateNextIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        {supportsLast && (
          <Tooltip title="Last">
            <span>
              <IconButton size="small" onClick={onLast} disabled={!hasLast} aria-label="Last">
                <LastPageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" sx={{ my: 2 }}>
      <Button variant="outlined" size="small" onClick={onFirst} disabled={!hasPrev}>First</Button>
      <Button variant="outlined" size="small" onClick={onPrev} disabled={!hasPrev}>Previous</Button>
      <Typography variant="caption">Page {pageIndex}</Typography>
      <Button variant="outlined" size="small" onClick={onNext} disabled={!hasNext}>Next</Button>
      {supportsLast && (
        <Button variant="outlined" size="small" onClick={onLast} disabled={!hasLast}>Last</Button>
      )}
    </Stack>
  );
}
