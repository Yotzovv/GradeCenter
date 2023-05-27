import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import HomeIcon from "@material-ui/icons/Home";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Nav() {
  return (
    <div>
      <nav>
        <List>
          {["Home", "My Class", "My schedulle" ].map((text, index) => (
              <ListItem button key={text} component="a" href={'/' + text.replace(' ', '-').toLowerCase()}>
                <ListItemIcon>
                  {
                    [<HomeIcon />, <PeopleIcon />, <CalendarMonthIcon />][index]
                  }
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
          ))}
        </List>
      </nav>
    </div>
  );
}
