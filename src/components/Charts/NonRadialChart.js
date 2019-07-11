import React, { Component } from 'react';
import Chart from "react-apexcharts";
import {
  Button,
  Segment,
  Sidebar,
  Form,
  Icon
} from 'semantic-ui-react'
import {nonRadialFormTypes} from '../../constants/constants'


const VerticalSidebar = ({ animation, direction, visible, submitChanges, state, handleChange, props, handleTempSeriesChange}) => (

  <Sidebar
    className='_editChartSideBarComponent'
    types={nonRadialFormTypes}
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
      options={nonRadialFormTypes}
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

      {(state.type === 'Title(x-axis)' &&
        <Form.Field>
          <label>Title (x-axis)</label>
          <Form.Input placeholder='X-axis Title' name='titleXAxis' value={state.titleXAxis || props.titleXAxis} onChange={handleChange} />
          <div className='_info'>
            To change title of X Axis, enter value above and click submit.
          </div>
        </Form.Field>
      )}

    {(state.type === 'Categories(x-axis)' &&
         <Form.Field>
           <label>Categories (x-axis)</label>
           <Form.Input placeholder='eg: jan,feb,mar' name='categoriesXAxis' value={state.categoriesXAxis || props.xAxisCategories} onChange={handleChange} />
           <div className='_info'>
             To change Categories of X-Axis , change entirely as 'value1,value2' or to change a particular value enter as <br/>
             eg - 0,0,value1 i.e 0 means no change.
           </div>
         </Form.Field>
      )}

      {(state.type === 'Title(y-axis)' &&
          <Form.Field>
            <label>Title (y-axis)</label>
            <Form.Input placeholder='Y-axis Title' name='titleYAxis' value={state.titleYAxis || props.titleYAxis} onChange={handleChange} />
            <div className='_info'>
              To change title of X Axis, enter value above and click submit.
            </div>
          </Form.Field>
      )}

      {(state.type === 'Series' &&
        state._series.map((serie,idx)=> {
          return (
            <div>
            <Form.Field>
              <label>Legends</label>
              <Form.Input placeholder='legends' name='name' value={serie.name} onChange={handleTempSeriesChange(idx)}/>
            </Form.Field>
            <Form.Field>
              <label>Series Value for {serie.name}</label>
              <Form.Input placeholder='values' name='data' value={serie.data} onChange={handleTempSeriesChange(idx)}/>
            </Form.Field>
            </div>
          )
          })
      )}
      <Button className='_nonRadialSubmitBtn' type='submit'>Submit</Button>
  </Form>

  </Sidebar>
)

class NonRadialChart extends Component {

  state = {
       type : '',
       name: '',
       titleXAxis: '',
       titleYAxis: '',
       categoriesXAxis:'',
       seriesValue: '',
       animation: 'overlay',
       direction: 'left',
       currentName : '',
       dimmed: false,
       visible: false,
       id : this.props.id,
       options: {
         type : this.props.type,
         chart: {
           shadow: {
             enabled: true,
             color: '#000',
             top: 18,
             left: 7,
             blur: 10,
             opacity: 1
           },
           toolbar: {
             show: false
           }
         },
         colors: ['#77B6EA', '#545454'],
         dataLabels: {
           enabled: true,
         },
         stroke: {
           curve: 'smooth'
         },
         title: {
           text: this.props.name,
           align: 'left'
         },
         grid: {
           borderColor: '#e7e7e7',
           row: {
             colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
             opacity: 0.5
           },
         },
         markers: {

           size: 7
         },
         xaxis: {
           categories: this.props.xAxisCategories,
           title: {
             text: this.props.titleXAxis
           }
         },
         yaxis: {
           title: {
             text: this.props.titleYAxis
           },
           min: 5,
           max: 40
         },
         legend: {
           position: 'top',
           horizontalAlign: 'right',
           floating: true,
           offsetY: -25,
           offsetX: -5
         }
       },
       _series: [],
       _categories: [],
       series: this.props.series
     }

     submitChanges = () => {

       const {
         _series,
         name,
         xAxisCategories,
         titleXAxis,
         titleYAxis,
         type,
         options,
         categories,
         yaxis } = this.state;

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
         case 'Title(x-axis)':
         this.setState({
           options: {
             ...options,
             xaxis : {
               ...categories,
               title : {
                 text : titleXAxis
               }
             }
           }
         })
         break;
         case 'Categories(x-axis)':
         this.setState({
           options: {
             ...options,
             xaxis : {
               categories : xAxisCategories.replace(/\s/g,'').split(','),
             }
           }
         })
         break;
         case 'Title(y-axis)':
         this.setState({
           options: {
             ...options,
             yaxis : {
               title : {
                 text : titleYAxis
               },
               ...yaxis
             }
           }
         })
         break;
         case 'Series':
         let updatedData = JSON.parse(JSON.stringify(_series))
         updatedData.map(key => {
           if(typeof key.data === 'string'){
             let _data = key.data.split(',');
             key.data = _data.map(num => {
               return parseInt(num, 10);
             })
           }
           return key;
         })
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

     handleTempSeriesChange = idx => (evt, name) => {
       const newSeries = this.state._series.map((serie, sidx) => {
         if (idx !== sidx) return serie;
        return { ...serie, [name.name]: evt.target.value };
        });

        this.setState({ _series: newSeries });
      };

     handleChange = (e, { name, value }) => {
       if(name === 'type' && value === 'Series'){
         let _temp = [...this.state._series];
         for(let i = 0; i < this.state.series.length; i++){
           _temp.push(
             {
               name: this.state.series[i].name,
               data: this.state.series[i].data
             }
           )
         }
         this.setState({
             [name]: value ,
             _series : _temp
           })
       }else{
         this.setState({
             [name]: value
           })
       }
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
       const { type } = this.props;
       console.log(this.props);
       return(
         <div className='test'>
           <Sidebar.Pushable as={Segment}>
             <VerticalSidebar handleTempSeriesChange={this.handleTempSeriesChange} handleChange={this.handleChange} submitChanges={this.submitChanges} props={this.props} state={this.state} animation={animation} direction={direction} visible={visible} />
             <Sidebar.Pusher dimmed={dimmed && visible}>
               <Segment basic>
                  <div id="chart" className='_chart1'>
                  <Chart options={options} series={series} type={type} height="350" />
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


export default NonRadialChart;
