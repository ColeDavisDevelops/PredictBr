import React, { useState, useEffect } from 'react';
// MATERIAL UI
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';



// COMPONENTS
import CustomSlider from './CustomSlider';


const useStyles = makeStyles(theme => ({
  predictions: {
    width: '100%'
  },
  controlPanel: {
    marginTop: 20
  },
  list: {
    width: '100%',
    padding: 0
  },
  myPositions: {
    maxHeight: 250,
    overflow: 'auto'
  },
  gameControlButton: {
    width: '100%',
    backgroundColor: '#5ee07d',
    color: 'white'    
  }
}));

/*
 *  allows user to interact with the game contract
 */
const Game = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    predictionVal: '',
  });
  const [open, setOpen] = useState({
    myPositions: false,
    allPredictions: false,
  });

  const handleOpenList = (listName) => {
    console.log(open)
    setOpen(open => ({
      ...open,
      [listName]: !open[listName]
    }))

  };

  const handleSlider = (e) => {
    setState({
      predictionVal: e.target.innerText
    })
    console.log(state)
  }

  // send user prediction and staked eth
  const handlePredict = () => {
    let value = parseInt(props.gameState.predictionCost, 10)
    let predictionInt = parseInt(state.predictionVal, 10)
    props.gameState.gameContract.methods.predict(predictionInt).send(
      {
        from: props.myAddress, 
        value: value,
        gas: 3000000
      })
      .then((err, res) => {
        if (!err) {
          console.log(res)
        } else {
          console.log(err)
        }
      })      
  }

  // claim most accurate position
  const handleClaimWinningPrediction = async() => {
    let differences = [];
    // get users positions and convert to differences    
    let numOfPositions = await props.gameState.gameContract.methods.prediction_number(props.myAddress).call()
    for (let i=0; i<numOfPositions; i++) {
      let userPrediction = await props.gameState.gameContract.methods.positions(props.myAddress, i).call()
      differences.push((Math.abs(userPrediction - parseInt(props.gameState.assetPrice))))
    }
    // find the most accurate prediciton
    let closestPrediction = Math.min.apply(Math, differences)
    let indexOfClosestPrediction = differences.indexOf(closestPrediction)
    // call claim winning prediciton
    props.gameState.gameContract.methods.claim_winning_prediction(indexOfClosestPrediction)
      .send({
        from: props.myAddress
      })
      .then((err, res) => {
        if (!err) {
          console.log(res)
        } else {
          console.log(err)
        }
      })
  }

  // collect winnings 
  const collectWinnings = () => {
    props.gameState.gameContract.methods.collect_my_winnings()
      .send({
        from: props.myAddress
      })
  }
  
  return (
    <div>    
      <Grid container style={{marginTop: 20}}>        
        <Grid item container>
          <List
            className={classes.list}
          >
            <ListItem divider button onClick={() => handleOpenList('myPositions')} className={classes.list}>
              <ListItemText 
                primaryTypographyProps={{
                  style: {
                    fontWeight: 'bold'
                  }
                }}
                primary="My Positions"
                
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.myPositions} timeout="auto" unmountOnExit className={classes.myPositions}>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  {(props.gameState !== undefined && props.gameState.myPositions.num > 0) ? (
                    props.gameState.myPositions.predictions.map(prediction => {
                      return (
                        <ListItemText primary={prediction} />
                      )
                    })   
                  ) : (                    
                    <ListItemText
                      primaryTypographyProps={{
                        style: {
                          fontWeight: 'lighter'
                        }
                      }}
                      primary="player has made no predictions" 
                    />                    
                  )}                                                   
                </ListItem>
              </List>
            </Collapse>
          </List>          
          <List
            className={classes.list}
          >
            <ListItem divider button onClick={() => handleOpenList('allPredictions')} className={classes.list}>
              <ListItemText 
                primaryTypographyProps={{
                  style: {
                    fontWeight: 'bold'
                  }
                }}
                primary="All Predictions"
                
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.allPredictions} timeout="auto" unmountOnExit className={classes.myPositions}>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>  
                  {(props.gameState !== undefined && props.gameState.countedPredictions > 0) ? (
                    Object.keys(props.gameState.countedPredictions).map(prediction => {
                      return (     
                        <Grid item container xs={12}>
                          <Grid item xs={6}>                  
                            <Typography align='left'>
                              {prediction}
                            </Typography>                                
                          </Grid>   
                          <Grid item xs={6}>                  
                            <Typography align='right' >
                              {props.gameState.countedPredictions[prediction]}
                            </Typography>                       
                          </Grid> 
                        </Grid>                                    
                      )
                    })) : (
                      <ListItemText
                        primaryTypographyProps={{
                          style: {
                            fontWeight: 'lighter'
                          }
                        }}
                        primary="no predictions have been made" 
                      />                         
                    )}                                                 
                </ListItem>
              </List>
            </Collapse>
          </List>                 
                           

                                     
        </Grid>
        
        <Grid item container xs={12} style={{marginTop: 20}}>
          <Grid item xs={12} className={classes.controlPanel}>
            <CustomSlider 
              aria-label="slider"
              defaultValue={Math.floor(props.lastPrice)} 
              max={Math.floor(props.lastPrice) * 5}
              valueLabelDisplay="on" 
              onChange={handleSlider}
              aria-valuetext={state.predictionVal}     
              step={1}         
            />
            <Button
              className={classes.gameControlButton} 
              variant='contained' 
              onClick={handlePredict}
            >
              predict
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.controlPanel}>
            <Button
              className={classes.gameControlButton} 
              variant='contained' 
              onClick={handleClaimWinningPrediction}
            >
              claim winning prediction
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.controlPanel}>
            <Button
              className={classes.gameControlButton} 
              variant='contained' 
              onClick={collectWinnings}
            >
              collect winnings
            </Button>
          </Grid>                  
        </Grid>
      </Grid>
    </div>
  )
}

export default Game;










  
