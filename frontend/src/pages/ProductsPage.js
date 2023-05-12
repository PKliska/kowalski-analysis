import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import samples2 from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Id', label: 'Id', alignRight: false },
  { id: 'FamilyName', label: 'Family name', alignRight: false },
  { id: 'ProductName', label: 'Product name', alignRight: false },
  { id: 'Name', label: 'Name', alignRight: false },
  {},
];

const TABLE_HEAD2 = [
  { id: 'Id', label: 'Id', alignRight: false },
  { id: 'Parameter', label: 'Parameter', alignRight: false },
  { id: 'Min', label: 'Min', alignRight: false },
  { id: 'Typical', label: 'Typical', alignRight: false },
  { id: 'Max', label: 'Max', alignRight: false },
  { id: 'TimeBetweenPoints', label: 'Time Between Points', alignRight: false },
  {},
];

const TABLE_HEAD3 = [
  { id: 'Id', label: 'Id', alignRight: false },
  { id: 'InputConditionId', label: 'Input Condition Id', alignRight: false },
  { id: 'SampleIds', label: 'Sample Ids', alignRight: false },
  { id: 'TestPoints', label: 'Test Points', alignRight: false },
  {},
];
// ----------------------------------------------------------------------

// const analyze = async (sampleId, project, pocetak, kraj) => {
//   const API_URI = 'http://localhost:9999/analyze';
//   const res = await axios.get(API_URI, {
//     responseType: 'blob',
//     params: { sampleId: sampleId, low: pocetak, high: kraj },
//     data: project,
//   });
//   return res.data.text();
// };

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  // console.log(array);

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductsPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [files, setFiles] = useState([]);
  const [visible, setVisible] = useState(true);

  const [name, setName] = useState('');
  const [samples, setSamples] = useState([]);
  const [inputConditions, setInputConditions] = useState([]);
  const [testPointCollections, setTestPointCollections] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // read file to object, check that its a json

    // if json, parse it and add it to the database

    if (acceptedFiles[0].type === 'application/json') {
      setVisible(false);

      const reader = new FileReader();

      reader.onload = function (e) {
        // Use reader.result

        const data = JSON.parse(reader.result);

        const name = data.Project.Name;
        setName(name);

        // console.log(samples2);
        // console.log(data.Project.Samples);

        setSamples(data.Project.Samples);
        setInputConditions(data.Project.InputConditions);
        setTestPointCollections(data.TestPointCollections);
      };

      reader.readAsText(acceptedFiles[0]);
    } else {
      alert('Please upload a JSON file');
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = samples.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - samples.length) : 0;

  const filteredUsers = applySortFilter(samples, getComparator(order, orderBy), filterName);
  const filteredUsers2 = applySortFilter(inputConditions, getComparator(order, orderBy), filterName);
  const filteredUsers3 = applySortFilter(testPointCollections, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {name}
          </Typography>
        </Stack>

        <div
          style={{
            display: visible ? 'block' : 'none',
          }}
        >
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="center" sx={{ mb: 5 }}>
            <Stack>
              {/* <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> */}
              {/* <ProductSort /> */}
              <Card>
                <div
                  style={{
                    width: '100%',
                    height: '100px',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#ff6300',
                    color: '#fff',
                  }}
                >
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>Drag 'n' drop some files here, or click to select files</p>
                    )}
                  </div>
                </div>
              </Card>
            </Stack>
          </Stack>
        </div>

        <div
          style={{
            display: visible ? 'none' : 'block',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Samples
          </Typography>
          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={samples.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { Id, FamilyName, ProductName, Name } = row;

                      console.log(row);

                      const selectedUser = selected.indexOf(Id) !== -1;

                      return (
                        <TableRow hover key={Id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Id)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Button
                                onClick={() => {
                                  if (
                                    !(
                                      samples.length > 0 &&
                                      inputConditions.length > 0 &&
                                      testPointCollections.length > 0
                                    )
                                  ) {
                                    alert('Please upload a JSON file');
                                    return;
                                  }

                                  const data = {
                                    Project: {
                                      Name: name,
                                      Samples: samples,
                                      InputConditions: inputConditions,
                                      Id: 1,
                                      ToSynthetise: Id,
                                      CreatedAt: new Date(),
                                    },
                                    TestPointCollections: testPointCollections,
                                  };

                                  // const json = JSON.stringify(data);

                                  let jsonOld = localStorage.getItem('json');

                                  if (jsonOld) {
                                    jsonOld = JSON.parse(jsonOld);
                                    jsonOld.push(data);
                                    localStorage.setItem('json', JSON.stringify(jsonOld));
                                  }

                                  if (!jsonOld) {
                                    localStorage.setItem('json', JSON.stringify([data]));
                                  }

                                  alert('Synthetised, go to Optimize Vector to optimize the vector');
                                }}
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                              >
                                <Typography variant="subtitle2" noWrap>
                                  Synthesise {Id}
                                </Typography>
                              </Button>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{FamilyName}</TableCell>

                          <TableCell align="left">{ProductName}</TableCell>

                          <TableCell align="left">{Name}</TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={inputConditions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>

          <></>
          <Typography variant="h4" gutterBottom>
            Input Conditions
          </Typography>

          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD2}
                    rowCount={inputConditions.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers2.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { Id, Parameter, Min, Typical, Max, TimeBetweenPoints } = row;

                      // console.log(row);

                      const selectedUser = selected.indexOf(Id) !== -1;

                      return (
                        <TableRow hover key={Id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Id)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Typography variant="subtitle2" noWrap>
                              {Id}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">{Parameter}</TableCell>

                          <TableCell align="left">{Min}</TableCell>

                          <TableCell align="left">{Typical}</TableCell>

                          <TableCell align="left">{Max}</TableCell>

                          <TableCell align="left">{TimeBetweenPoints}</TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={samples.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>

          <></>
          <Typography variant="h4" gutterBottom>
            Test Point Collections
          </Typography>

          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD3}
                    rowCount={testPointCollections.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers3.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { Id, InputConditionId, SampleIds, TestPoints } = row;

                      // console.log(row);

                      const selectedUser = selected.indexOf(Id) !== -1;

                      return (
                        <TableRow hover key={Id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Id)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {Id}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{InputConditionId}</TableCell>

                          <TableCell align="left">{SampleIds}</TableCell>

                          <TableCell align="left">
                            {
                              // join array to string

                              TestPoints.map((item, index) => {
                                return (
                                  <div key={index}>
                                    ‣ {item.Value} {item.Unit}
                                  </div>
                                );
                              })
                            }
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={samples.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </div>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
