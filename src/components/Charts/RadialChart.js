import React, { Component } from 'react';
import Chart from "react-apexcharts";
import {
  Button,
  Segment,
  Sidebar,
  Form,
  Icon
} from 'semantic-ui-react'
import {radialFormTypes} from '../../constants/constants'


const VerticalSidebar = ({ animation, direction, visible, submitChanges, state, handleChange, props}) => (

  <Sidebar
    className='_editChartSideBarComponent'
    types={radialFormTypes}
    animation={animation}
    direction={direction}
    icon='labeled'
    inverted='true'
    vertical='true'
    visible={visible}
    width='thin'
  >
  <Form onSubmit={submitChanges}>
    <h3>Change Graph Details</h3>
    <Form.Select
      fluid
      label=''
      name='type'
      value={state.type}
      options={radialFormTypes}
      placeholder='Change Type'
      onChange={handleChange}
       />
        {(state.type === 'Name' &&
        <Form.Field>
          <label>Graph Name</label>
          <Form.Input placeholder='Name' name='name' value={state.name || props.name} onChange={handleChange} />
          <div className='_info'>
            To change name, enter value above and click submit.
          </div>
        </Form.Field>
      )}


    {(state.type === 'Labels' &&
         <Form.Field>
           <label>Categories (x-axis)</label>
           <Form.Input placeholder='eg: jan,feb,mar' name='_labels' value={state._labels || props.labels} onChange={handleChange} />
           <div className='_info'>
             To change labels , change entirely as 'value1,value2' or to change a particular value.
           </div>
         </Form.Field>
      )}


      {(state.type === 'Series' &&
      <Form.Field>
        <label>Series Value</label>
        <Form.Input placeholder='series' name='_series' value={state._series || props.series} onChange={handleChange}/>
      </Form.Field>
      )}
      <Button type='submit'>Submit</Button>
  </Form>

  </Sidebar>
)

class RadialChart extends Component {

  state = {
       name: '',
       animation: 'overlay',
       direction: 'left',
       currentName : '',
       dimmed: false,
       visible: false,
       _labels: this.props.labels,
       id : this.props.id,
       _series: '',
       options: {
            labels: this.props.labels,
            responsive: [{
              breakpoint: 480,
              options: {
                title : {
                  text : this.props.name,
                  align: 'left'
                },
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
        series: this.props.series
     }

     submitChanges = () => {

       const {
         _series,
         name,
         type,
         options,
         _labels,
        } = this.state;

       switch(type) {
         case 'Name':
         this.setState({
         options: {
           ...options,
           title : {
             text : name
            }
          }
        })
         break;
         case 'Labels':
         this.setState({
           options: {
             ...options,
             labels : _labels.replace(/\s/g,'').split(',')
           }
         })
         break;
         case 'Series':
         let updatedData = [];
         for(let serie of this.state._series.split(',')){
           updatedData.push(parseInt(serie, 10))
         }
         this.setState({
           series: updatedData
         })
         break;
         default:
         break;
        }

        this.setState({
          type : ''
        })
        this.handleHideClick();

     }

     handleChange = (e, { name, value }) => {
         this.setState({
             [name]: value
           })
     }

     handleAnimationChange = animation => () =>
     this.setState(prevState => ({ animation, visible: !prevState.visible }))

     handleHideClick = () => this.setState({ visible: false })


     handleDirectionChange = direction => () => this.setState({ direction, visible: false })

     deleteChart = () => {
       const {id} = this.state;
       this.props.deleteChart(id);
     }


     render(){
       const { options, series, animation, dimmed, direction, visible } = this.state;
       return(
         <div className='test'>
           <Sidebar.Pushable as={Segment}>
             <VerticalSidebar handleChange={this.handleChange} submitChanges={this.submitChanges} props={this.props} state={this.state} animation={animation} direction={direction} visible={visible} />
             <Sidebar.Pusher dimmed={dimmed && visible}>
               <Segment basic>
                  <div id="chart" className='_chart1'>
                  <Chart options={options} series={series} type="pie" width="470" />
                  <Button className='_editBtn' onClick={this.handleAnimationChange('scale down')}>{visible ? 'Close' : 'Edit Chart'}</Button>
                  <Button disabled={visible} className='_deleteBtn' onClick={this.deleteChart}><Icon name='delete' />Delete</Button>
                </div>
               </Segment>
             </Sidebar.Pusher>
           </Sidebar.Pushable>
         </div>
       )
    }
}


export default RadialChart;
