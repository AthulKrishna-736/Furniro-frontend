import React from 'react';
import { Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const AddressModal = ({
  open,
  handleCloseModal,
  handleSaveAddress,
  handleInputChange,
  formData,
  errors,
  states,
}) => {
  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          marginTop: "5%",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          overflowY: "auto",
          maxHeight: "75vh",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "15px" }}>
          {formData.name ? "Edit Address" : "Add Address"}
        </Typography>

        <TextField
          label="Name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "15px" }}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "15px" }}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />

        <Box sx={{ display: "flex", gap: "20px" }}>
          <TextField
            label="Pincode"
            name="pincode"
            value={formData.pincode || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "15px" }}
            error={!!errors.pincode}
            helperText={errors.pincode}
          />
          <TextField
            label="Locality"
            name="locality"
            value={formData.locality || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "15px" }}
            error={!!errors.locality}
            helperText={errors.locality}
          />
        </Box>

        <Box sx={{ display: "flex", gap: "20px" }}>
          <TextField
            label="District"
            name="district"
            value={formData.district || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "15px" }}
            error={!!errors.district}
            helperText={errors.district}
          />
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              label="State"
              error={!!errors.state}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Alternative Phone Number (Optional)"
          name="altPhoneNumber"
          value={formData.altPhoneNumber || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: "15px" }}
          error={!!errors.altPhoneNumber}
          helperText={errors.altPhoneNumber}
        />

        <FormControl fullWidth sx={{ marginBottom: "15px" }}>
          <InputLabel>Address Type</InputLabel>
          <Select
            name="type"
            value={formData.type || ""}
            onChange={handleInputChange}
            label="Address Type"
          >
            <MenuItem value="home">Home</MenuItem>
            <MenuItem value="office">Office</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            sx={{
              color: "black",
              borderColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
                color: "white",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleSaveAddress}
            sx={{
              color: "black",
              borderColor: "#2e7d32",
              "&:hover": {
                backgroundColor: "#2e7d32",
                color: "white",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddressModal;
