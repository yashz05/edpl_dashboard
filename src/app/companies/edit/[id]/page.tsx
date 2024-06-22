"use client";

import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export default function CategoryEdit() {
  const {
    saveButtonProps,
    register,
    
    formState: { errors },
  } = useForm({});


  //   // {
  //     "_id": "663cc44fdf83f25313e3fc00",
  //     "name": "Yash Chowdhari",
  //     "email": "yash@gmai.com",
  //     "active": true,
  //     "uuid": "43708",
  //     "password": "$2b$10$D/VsnU/67PWoTs4UUQCgB.CrIKfYsWF9nNggBh.MTgJsZga4SUb8u",
  //     "__v": 0
  // }
  return (
    <Edit saveButtonProps={saveButtonProps} title="Edit Sales Person Information">
      <Box
        component="form"

        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Name"}
          name="name"
        />

        <TextField
          {...register("email", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Email"}
          name="email"
        />

        <TextField
          {...register("password", { value: { 'password': '' } })}
          error={!!errors.password}

          defaultValue=""
          // helperText={errors.password?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Password"
          type="password"
          name="password"
        />
        <TextField
          {...register("uuid", { value: { 'password': '' } })}
          error={!!errors.uuid}

       
          // helperText={errors.password?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="UUID"
          type="text"
          name="UUID"
          disabled
        />

      </Box>
    </Edit>
  );
}
