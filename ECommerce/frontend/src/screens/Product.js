import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../components/Store';
import { getError } from '../components/Utils';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Rating from '../components/Rating';

//replace use state by use reducer (simple and not complex)
const reducer = (state, action) =>{
  switch(action.type){
    case 'FETCH_REQUEST':
      return{...state, loading:true};
      case 'FETCH_SUCCESS':
        return{...state, product:action.payload, loading:false};
        case 'FETCH_FAIL':
          return{...state, loading:false, error:action.payload}
          default:
            return state;
  }
}

function Product() {
  const navigate = useNavigate();
    const params = useParams();
    const {slug} = params;

    //api connection
  const[{loading, error, product}, dispatch] = useReducer(reducer,
  {
    product:[],
    loading:true,
     error:'',
  })
//const [products, setProducts] = useState([]);
useEffect(()=>{
  dispatch({type:'FETCH_REQUEST'});
 
    const fetchData = async()=>{
      try{
       const result = await axios.get(`/api/products/slug/${slug}`);
       dispatch({type:'FETCH_SUCCESS',payload:result.data})
  }
  catch(e){
    dispatch({type:'FETCH_FAIL',payload:getError(e)});
  }

//setProducts(result.data);
};
fetchData();
},[slug]);
const {state, dispatch: ctxDispatch} =useContext(Store);
const {cart} = state;
const addToCartHandler = async() =>{
  const existItem = cart.cartItems.find((x)=> x._id === product._id);
  const quantity = existItem ? existItem.quantity + 1 : 1;
  const { data }= await axios.get(`/api/products/${product._id}`);

  if (data.countInStock < quantity) {
    window.alert('Sorry. Product is out of stock');
    return;}
  ctxDispatch({
    type:'CART_ADD_ITEM',
     payload: {...product, quantity},
    });
    
    navigate('/cart');
};
  return loading ? (
    <div>laoding...</div>
   ):error?( <div>{error}</div>)
   :( <div>
    <h1>{slug}</h1>
    <Row>
      <Col md={6}>
        <img
          className="img-large"
          src={product.image}
          alt={product.name}
        ></img>
      </Col>
      <Col md={3}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <h1>{product.name}</h1>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating
              rating={product.rating}
              numReviews={product.numReviews}
            ></Rating>
          </ListGroup.Item>
          <ListGroup.Item>Pirce : ${product.price}</ListGroup.Item>
          <ListGroup.Item>
            Description:
            <p>{product.description}</p>
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg="success">In Stock</Badge>
                    ) : (
                      <Badge bg="danger">Unavailable</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button onClick={addToCartHandler}  variant="primary">Add to Cart</Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
  );
}

export default Product