import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"; // Import DataGrid instead of DataGridPro
import { School } from "../../models/school";
import { AspNetUser, UserRoles } from "../../models/aspNetUser";
import { SchoolClass } from "../../models/schoolClass";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import requests from "../../requests";

interface AllSchoolsGridParams {
  allSchools: School[] | null;
}

export default function AllSchoolsGrid(params: AllSchoolsGridParams | null) {
  let data: School[] | AspNetUser[] | SchoolClass[] | null = null;
  let columns: GridColDef[] | null = null;
  
  if (params && params.allSchools && params!.allSchools!.length > 0) {
    data = params!.allSchools;
    columns = [
      { field: "name", headerName: "Name", width: 100 },
      { field: "address", headerName: "Address", width: 150 },
      { field: "isActive", headerName: "Active", width: 100,
      renderCell: (params: GridRenderCellParams) => {
        const toggleStatus = () => {
          console.log(params.row.isActive)
          if(params.row.isActive == true) {
            requests.deleteSchool(params.row.name);
          } else {
            requests.activateSchool(params.row.name);
          }
        };

        return (
          <Button
            size="small"
            variant="contained"
            sx={{ borderRadius: "12%", height: 40, fontSize: 12 }}
            color={params.value ? "success" : "error"}
            onClick={toggleStatus}
          >
            <h4>{params.row.isActive ? "Active" : "Inactive"}</h4>
          </Button>
        );
      },
     },
    ];
  }

  return (
    <Box sx={{ height: 520, width: "100%" }}>
      <DataGrid
        columns={columns!}
        rows={data || []}
        loading={data!.length === 0}
        rowHeight={48}
        checkboxSelection={false}
      />
    </Box>
  );
}
