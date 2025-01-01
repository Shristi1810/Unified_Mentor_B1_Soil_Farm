import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
    useGetPurchaseDetailsQuery,
    useUpdatePurchaseMutation,
} from '../../slices/purchasesApiSlice';
import { TextField, Grid } from '@mui/material';

const PurchaseEditScreen = () => {
  const { id: purchaseId } = useParams();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState(new Date());
  const [cost, setCost] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: purchase,
    isLoading,
    refetch,
    error,
  } = useGetPurchaseDetailsQuery(purchaseId);

  const [updatePurchase, { isLoading: loadingUpdate }] =
    useUpdatePurchaseMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updatePurchase({
        purchaseId,
        name,
        brand,
        category,
        qty,
        date,
        cost,
        description,
      });
      toast.success('Purchase updated');
      refetch();
      navigate('/admin/purchaseslist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (purchase) {
      setName(purchase.name);
      setBrand(purchase.brand);
      setCategory(purchase.category);
      setQty(purchase.qty);
      setDate(purchase.date)
      setCost(purchase.cost);
      setDescription(purchase.description);
    }
  }, [purchase]);


  return (
    <>
      <Link to='/admin/purchaseslist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Purchase</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
             <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Grid>


    <Grid item xs={12}>
      <TextField
        variant="outlined"
        fullWidth
        id="brand"
        label="Brand"
        name="brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
    </Grid>


    <Grid item xs={12}>
    <TextField
        variant="outlined"
        fullWidth
        id="category"
        label="Purpose"
        name="category"
        type='text'
        placeholder='Enter category'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
    />
    </Grid>
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        //required
        fullWidth
        id="qty"
        label="Quantity"
        name="qty"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
    <TextField
        variant="outlined"
        fullWidth
        id="date"
        label="Date"
        name="date"
        type='Date'
        placeholder='Enter Date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
    />
    </Grid>
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        id="cost"
        label="Cost"
        name="cost"
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
    <TextField
        variant="outlined"
        fullWidth
        id="description"
        label="Description"
        name="description"
        type='text'
        placeholder='Enter description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
    />
    </Grid>
</Grid>
            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default PurchaseEditScreen;