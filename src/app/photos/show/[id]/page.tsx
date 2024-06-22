"use client";

import { decrypt } from "@app/enc";
import { Button, Typography, styled } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { useCookies } from 'next-client-cookies';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { photos } from "@providers/data-provider";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
export default function CategoryShow() {
  const cookieStore = useCookies();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const token = decrypt(cookieStore.get("token") ?? '');
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const { queryResult } = useShow({
    metaData: {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }
  });
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const { data, isLoading } = queryResult;
  const record = data?.data;
  console.log(record);

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
       Add Image 
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            // @ts-ignore
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>

      <Show isLoading={isLoading}>

        {isLoading ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          <ImageList sx={{ width: 500, height: 450 }}>
            <ImageListItem key="Subheader" cols={5}>

            </ImageListItem>
            {record && record.map((item: any) => (
              <ImageListItem key={item.name}>
                <img
                  srcSet={`${photos}${item.file_name}`}
                  src={`${photos}${item.file_name}`}
                  alt={item.name}
                  width={"100px"}
                  height={"100px"}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.name}
                  actionIcon={
                    <IconButton
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label={`info about ${item.name}`}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Show>
    </>
  );
}
