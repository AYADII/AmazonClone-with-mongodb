import {React,useEffect,useReducer} from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';

import Col from 'react-bootstrap/Col'
import ProductItem from '../components/ProductItem';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
//import data from '../data';

function Home() {
  //replace use state by use reducer (simple and not complex)
  const reducer = (state, action) =>{
    switch(action.type){
      case 'FETCH_REQUEST':
        return{...state, loading:true};
        case 'FETCH_SUCCESS':
          return{...state, products:action.payload, loading:false};
          case 'FETCH_FAIL':
            return{...state, loading:false, error:action.payload}
            default:
              return state;
    }
  }



  //api connection
  const[{loading, error, products}, dispatch] = useReducer(logger(reducer),
    {
      products:[],
      loading:true,
       error:'',
    })
  //const [products, setProducts] = useState([]);
  useEffect(()=>{
    dispatch({type:'FETCH_REQUEST'});
   
      const fetchData = async()=>{
        try{
         const result = await axios.get('/api/products');
         dispatch({type:'FETCH_SUCCESS',payload:result.data})
    }
    catch(e){
      dispatch({type:'FETCH_FAIL',payload: e.message});
    }

  //setProducts(result.data);
  };
  fetchData();
  },[]);
  return (
    
    <div className="products">
      <Helmet>
      <title>Amazon</title> 
      </Helmet>
      <h1> Featured Products</h1>
     
      {
        loading? <LoadingBox />:
        
        error?<MessageBox variant="danger">{error}</MessageBox>
        :(
          <div className="home__row">
  <Row>
      {products.map((product) => (
        <Col sm={6} md={4} lg={3} className="mb-3">
            <ProductItem product={product}></ProductItem> 
          </Col>
     )) }
     </Row>
  </div>
        )}
       </div>
    
  );
}

export default Home;