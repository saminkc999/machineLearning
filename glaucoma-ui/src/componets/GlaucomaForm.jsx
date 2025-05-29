import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const featureNames = [
  'sbp', 'dbp', 'hr', 'iop', 'vcdr', 'notchI_present', 'notchS_present',
  'notchN_present', 'notchT_present', 'expert1_grade', 'expert2_grade',
  'expert3_grade', 'expert4_grade', 'expert5_grade', 'cdr_avg', 'cdr_expert1',
  'cdr_expert2', 'cdr_expert3', 'cdr_expert4', 'refractive_dioptre_1',
  'refractive_dioptre_2', 'refractive_astigmatism', 'pachymetry', 'axial_length'
];

export default function GlaucomaForm() {
  const [values, setValues] = useState(Array(featureNames.length).fill(''));
  const [result, setResult] = useState(null);

  const handleChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const handleSubmit = async () => {
    const features = values.map(v => parseFloat(v));
    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });
      const data = await res.json();
      setResult(data.prediction);
    } catch (err) {
      console.error("Error contacting server:", err);
      setResult("Error contacting server.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <MedicalInformationIcon color="primary" fontSize="large" />
        <Typography variant="h4">Glaucoma Detection</Typography>
      </Box>

      <Grid container spacing={2}>
        {featureNames.map((name, i) => (
          <Grid item xs={6} sm={4} key={name}>
            <TextField
              fullWidth
              type="number"
              label={name}
              variant="outlined"
              value={values[i]}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Predict
          </Button>
        </motion.div>
      </Box>

      {result && (
        <Box mt={4} textAlign="center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: result === '1' ? 'red' :
                       result === '0' ? 'green' :
                       'orange',
                fontWeight: 'bold'
              }}
            >
              {result === '1'
                ? 'Not Glaucoma'
                : result === '0'
                ? 'Glaucoma'
                : result}
            </Typography>
          </motion.div>
        </Box>
      )}
    </Container>
  );
}
