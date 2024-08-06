'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import { collection, getDoc, getDocs, query, setDoc, deleteDoc, doc } from "firebase/firestore";


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateQuantity, setUpdateQuantity] = useState(0);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const updateItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await setDoc(docRef, { quantity });
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (name, quantity) => {
    setUpdateName(name);
    setUpdateQuantity(quantity);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  return (
    <Box width="100vw" height="100vh"  display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} bgcolor="white">
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" bgcolor="white" top="50%" left="50%" width={400} border="2px solid #333" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
          <Typography variant="h6" color="black">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined' fullWidth value={itemName} onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button variant="outlined" onClick={async () => {
              await addItem(itemName);
              setItemName('');
              handleClose();
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={updateOpen} onClose={handleUpdateClose}>
        <Box position="absolute" top="50%" left="50%" width={400} border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
          <Typography variant="h6">Update Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined' fullWidth value={updateName} disabled
            />
            <TextField
              variant='outlined' fullWidth value={updateQuantity} type="number" onChange={(e) => {
                setUpdateQuantity(parseInt(e.target.value));
              }}
            />
            <Button variant="outlined" onClick={async () => {
              await updateItem(updateName, updateQuantity);
              setUpdateName('');
              setUpdateQuantity(0);
              handleUpdateClose();
            }}>
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border='1px solid #333'>
        <Box width="1100px" height="100px" bgcolor="#ADD8E6">
          <Typography variant='h2' color='#333' display='flex' alignItems="center" justifyContent="center">
            Inventory Items
          </Typography>
        </Box>

        <Stack width="1100px" height="600px"  spacing={2} overflow="auto" >
          {inventory.map(({ name, quantity }) => (
            <Box key={name} width="100%"  minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor='#f0f0f0' padding={5}>
              <Typography variant="h3" color='#333' textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant="h3" color='#333' textAlign="center">
                {quantity}
              </Typography>

              <Button variant="contained" onClick={() => addItem(name)}>
                Add
              </Button>

              <Button variant="contained" onClick={() => handleUpdateOpen(name, quantity)}>
                Update
              </Button>

              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
