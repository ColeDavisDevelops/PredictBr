import React from 'react';
import Graph from './Graph';
import { NavLink } from 'react-router-dom';
// MATERIAL UI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  productGrid: {

  },
  productSquare: {
    margin: 'auto',
    padding: 10
  },
  gameButton: {
    width: '100%',
    minHeight: 200,
    backgroundColor: '#616161',
    color: '#5ee07d',
    fontWeight: 'bold',
    fontSize: 15
  },
}));

const ProductSelection = () => {
  const classes = useStyles();              
  
  return (
    <div>
      <Grid container className={classes.productGrid}>
        <Grid item className={classes.productSquare} xs={12} sm={6}>
          <NavLink style={{ textDecoration: 'none', color: 'unset' }} color="inherit" to='/SPY'>
            <Button variant='contained' className={classes.gameButton}>
              <p>sp 500</p>  
            </Button>
          </NavLink>
        </Grid>
        <Grid item className={classes.productSquare} xs={12} sm={6}>
          <NavLink style={{ textDecoration: 'none', color: 'unset' }} color="inherit" to='/GLD'>
            <Button variant='contained' className={classes.gameButton}>
              <p>gold</p>  
            </Button>
          </NavLink>            
        </Grid>
        <Grid item className={classes.productSquare} xs={12} sm={6}  >
          <NavLink style={{ textDecoration: 'none', color: 'unset' }} color="inherit" to='/USO'>
            <Button variant='contained' className={classes.gameButton}>
              <p>USO</p>  
            </Button>
          </NavLink>
        </Grid>
        <Grid item className={classes.productSquare} xs={12} sm={6}  >            
          <NavLink style={{ textDecoration: 'none', color: 'unset' }} color="inherit" to='/ETH'>
            <Button variant='contained' className={classes.gameButton}>
              <p>ethereum</p> 
            </Button>           
          </NavLink>  
        </Grid>                              
      </Grid>                      
    </div>  
  )
}

export default ProductSelection;