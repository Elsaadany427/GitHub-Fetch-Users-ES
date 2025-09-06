import { useEffect, useMemo, useState, useTransition, useDeferredValue } from 'react';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import useFetchUsers from '../hooks/useFetchUsers';
// Server-side pagination hooks
import useUsersCursor from '../hooks/useUsersCursor';
import useSearchUsers from '../hooks/useSearchUsers';
import SearchBar from '../components/SearchBar';
import UserTable from '../components/UserTable';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import CursorPager from '../components/CursorPager';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Home() {
  // Control which data strategy to use
  const [mode, setMode] = useState('client'); // 'client' | 'server'
  // Client mode: fetch once and paginate locally
  const [fetchCount, setFetchCount] = useState(100);
  const { users, loading, error } = useFetchUsers(fetchCount);
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.login.toLowerCase().includes(q));
  }, [users, deferredQuery]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = filtered.length;
  const start = (page - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);
  const isSearching = deferredQuery.trim().length > 0;
  const cursor = useUsersCursor(pageSize);
  const search = useSearchUsers(deferredQuery, page, pageSize);

  useEffect(() => {
    setPage(1);
    if (mode === 'server') {
      if (!isSearching) cursor.reset();
    }
  }, [deferredQuery, pageSize, mode]);


  return (
    <Container sx={{ my: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <SearchBar onSearch={(v) => startTransition(() => setQuery(v))} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="mode-label">Data Mode</InputLabel>
          <Select
            labelId="mode-label"
            label="Data Mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="server">Server</MenuItem>
          </Select>
        </FormControl>
        {mode === 'client' && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="fetch-count-label">Fetch Size</InputLabel>
            <Select
              labelId="fetch-count-label"
              label="Fetch Size"
              value={fetchCount}
              onChange={(e) => setFetchCount(Number(e.target.value))}
            >
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        )}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="page-size-label">Page Size</InputLabel>
          <Select
            labelId="page-size-label"
            label="Page Size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {mode === 'client' ? (
        <>
          {loading && <LoadingSpinner />}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {!error && (
            <>
              <UserTable users={current} />
              <Pagination page={page} pageSize={pageSize} totalItems={totalItems} onChange={setPage} />
              {loading && <LoadingSpinner />}
            </>
          )}
        </>
      ) : (
        <>
          {(isSearching ? search.loading : cursor.loading) && <LoadingSpinner />}
          {(isSearching ? search.error : cursor.error) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {isSearching ? search.error : cursor.error}
            </Alert>
          )}
          {!isSearching ? (
            <>
              <UserTable users={cursor.users} />
              <CursorPager
                pageIndex={cursor.pageIndex}
                hasPrev={cursor.hasPrev}
                hasNext={cursor.hasNext}
                onPrev={cursor.prev}
                onNext={cursor.next}
                onFirst={cursor.reset}
              />
              {cursor.loading && <LoadingSpinner />}
            </>
          ) : (
            <>
              <UserTable users={search.users} />
              <Pagination page={page} pageSize={pageSize} totalItems={search.total} onChange={setPage} />
              {search.loading && <LoadingSpinner />}
            </>
          )}
        </>
      )}
    </Container>
  );
}
