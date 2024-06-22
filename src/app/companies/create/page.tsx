"use client";

import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export default function BlogPostCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({});



  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps} >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!errors.name}
         
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
          error={!!errors.email}
        
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Email"}
          name="email"
        />
        
        <TextField
          {...register("password", {
            required: "This field is required",
          })}
          error={!!errors.password}
        
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="password"
          label={"Password"}
          name="password"
        />
        
      </Box>
    </Create>
  );
}
