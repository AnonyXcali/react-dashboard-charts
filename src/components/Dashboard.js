import React, { Component, createRef } from 'react';
import {
  Button,
  Segment,
  Sidebar,
  Form
} from 'semantic-ui-react'
import {options} from '../constants/constants'
import NonRadialChart from './Charts/NonRadialChart'
import RadialChart from './Charts/RadialChart'

const VerticalSidebar = ({ animation, direction, visible, submitChanges, state, handleChange, validateForm}) => (

  <Sidebar
    className='_sideBarComponent'
    options={options}
    animation={animation}
    direction={direction}
    icon='labeled'
    inverted='true'
    vertical='true'
    visible={visible}
    width='thin'
  >
  <Form onSubmit={submitChanges}>
    <h3>Enter Graph Details</h3>
    <Form.Select
      fluid
      label=''
      name='type'
      value={state.type}
      options={options}
      placeholder='Chart Type'
      onChange={handleChange}
      error={state.typeInvalid}
       />
       {((state.type !== 'pie' && state.type.length > 0) &&
       <div>
       <Form.Field>
         <label>Graph Name</label>
         <Form.Input placeholder='Name' name='name' value={state.name} onChange={handleChange} error={state.nameInvalid}/>
       </Form.Field>
       <Form.Field>
         <label>Title (x-axis)</label>
         <Form.Input placeholder='X-axis Title' name='titleXAxis' value={state.titleXAxis} onChange={handleChange} error={state.titleXAxisInvalid}/>
       </Form.Field>
       <Form.Field>
         <label>Categories (x-axis)</label>
         <Form.Input placeholder='eg: jan,feb,mar' name='categoriesXAxis' value={state.categoriesXAxis} onChange={handleChange} error={state.categoriesXAxisInvalid}/>
       </Form.Field>
       <Form.Field>
         <label>Title (y-axis)</label>
         <Form.Input placeholder='Y-axis Title' name='titleYAxis' value={state.titleYAxis} onChange={handleChange} error={state.titleYAxisInvalid}/>
       </Form.Field>
       <Form.Field>
         <label>Legends</label>
         <Form.Input placeholder='legends' name='legends' value={state.legends} onChange={handleChange} error={state.legendsInvalid}/>
       </Form.Field>
       <Form.Field>
         <label>Series Value</label>
         <Form.Input placeholder='eg: 1,2,3<space>4,5,6' name='seriesValue' value={state.seriesValue} onChange={handleChange} error={state.seriesValueInvalid}/>
         <div className='_info'>
           Please enter values equivalent to number of legend(s) <br/>
           For eg : if number of labels 2 <br/>
           input : 1,2,3 space 4,5,6
         </div>
       </Form.Field>
       </div>
        )}

        {(state.type === 'pie' &&
        <div>
        <Form.Field>
          <label>Graph Name</label>
          <Form.Input placeholder='Name' name='name' value={state.name} onChange={handleChange} error={state.labelsInvalid}/>
        </Form.Field>
        <Form.Field>
          <label>Labels</label>
          <Form.Input placeholder='eg: jan,feb,mar' name='labels' value={state.labels} onChange={handleChange} error={state.labelsInvalid}/>
        </Form.Field>
        <Form.Field>
          <label>Series Value</label>
          <Form.Input placeholder='eg: 1,2,3' name='seriesValue' value={state.seriesValue} onChange={handleChange} error={state.seriesValueInvalid}/>
        </Form.Field>
        </div>
         )}

         {(state.type.length <= 0 &&
         <p>Select a Chart type</p>
          )}


    <Button className='_submitFromDashboard' type='submit'>Submit</Button>
  </Form>

  </Sidebar>
)


class Dashboard extends Component {
    state = {
      name: '',
      nameInvalid : false,
      type: '',
      typeInvalid : false,
      labels:'',
      labelsInvalid : false,
      titleXAxis: '',
      titleXAxisInvalid : false,
      titleYAxis: '',
      titleYAxisInvalid : false,
      categoriesXAxis:'',
      categoriesXAxisInvalid : false,
      legends: '',
      legendsInvalid : false,
      seriesValue: '',
      seriesValueInvalid : false,
      animation: 'overlay',
      direction: 'left',
      currentName : '',
      dimmed: false,
      visible: false,
      charts : [],
      count : 0,
      formInvalid : false
    }

    lineChartElement = createRef();

    submitChanges = () => {
      let invalids = this.validateForm();
      if(invalids.length > 0){
        for(let invalid of invalids){
          let inval = invalid+'Invalid'
          this.setState({
            [inval]: true
          })
        }
        return false;
      }


      const name = this.state.name;
      const id = this.state.count+1;
      const type = this.state.type;
      const labels = this.state.labels.replace(/\s/g,'').split(',');
      const xAxisCategories = this.state.categoriesXAxis.replace(/\s/g,'').split(',');
      const titleXAxis = this.state.titleXAxis;
      const titleYAxis = this.state.titleYAxis;
      const seriesValues = type === 'pie' ? this.state.seriesValue.replace(/\s/g,'').split(',') : this.state.seriesValue.split(' ');
      const legends = this.state.legends.split(',');
      const series = [];
      let iter = 0;

      if(type !== 'pie' ){
        for(let serie of seriesValues){
          let data = serie.split(',');
          let parsedIntData = data.map(num => {
            return parseInt(num);
          })
          series.push({
            name : legends[iter++],
            data : parsedIntData
          })
        }
      }else{
        for(let serie of seriesValues){
          series.push(parseInt(serie))
        }
      }

      const ele = type === 'pie' ?
      <RadialChart
        key={id+'_pie'}
        labels={labels}
        id={id}
        name={name}
        series={series}
        deleteChart={(id) => {this.deleteChart(id)}}
      />
      : <NonRadialChart
        key={id+'_chart'}
        titleYAxis={titleYAxis}
        titleXAxis={titleXAxis}
        xAxisCategories={xAxisCategories}
        series={series}
        ref={this.lineChartElement}
        type={type}
        id={id}
        name={name}
        deleteChart={(id) => {this.deleteChart(id)}}
        />
      const chart = {
        id,
        name,
        element : ele
      }

      this.setState({
        charts : [...this.state.charts, chart],
        count : this.state.count + 1,
        name: '',
        type: '',
        titleXAxis: '',
        titleYAxis: '',
        categoriesXAxis:'',
        legends:'',
        seriesValue: '',
        labels: ''
      })
      this.handleHideClick();
    }

    deleteChart = id => {
      const { charts } = this.state;
      this.setState({
        charts : charts.filter(chart => {
          if(chart.id !== id){
            return chart
          }
        }),
        count: this.state.count-1
      })
    }

    validateForm = () => {

      let invalidInput = [];
      const{ name, type, labels, titleXAxis, titleYAxis, categoriesXAxis, legends, seriesValue } = this.state;

      if(!type || type.length <= 0){
        invalidInput.push('type');
      }

      if(!name || name.length <=0){
        invalidInput.push('name');
      }

      if((!labels || labels.length <=0) && type === 'pie'){
        invalidInput.push('labels');
      }

      if((!titleXAxis || titleXAxis.length <=0) && type !== 'pie'){
        invalidInput.push('titleXAxis');
      }
      if((!titleYAxis || titleYAxis.length <=0) && type !== 'pie'){
        invalidInput.push('titleYAxis');
      }
      if((!categoriesXAxis || name.categoriesXAxis <=0) && type !== 'pie'){
        invalidInput.push('categoriesXAxis');
      }
      if((!legends || legends.length <=0) && type !== 'pie'){
        invalidInput.push('legends');
      }
      if((!seriesValue || seriesValue.length <=0)){
        invalidInput.push('seriesValue');
      }

      return invalidInput;
    }

    handleChange = (e, { name, value }) => {
      if(this.state.type.length > 0 && name === 'type'){
        let formFields = ['nameInvalid', 'typeInvalid', 'titleXAxisInvalid', 'titleYAxisInvalid', 'categoriesXAxisInvalid', 'legendsInvalid', 'seriesValueInvalid', 'labelsInvalid'];
        for(let forms of formFields){
          this.setState({
            [name]: value,
            [forms] : false
          })
        }
      }else{
        let checker = name+'Invalid';
        this.setState(
          {
            [name]: value,
            [checker]: false
          })
        }
      }


    handleHideClick = () => this.setState({ visible: false })

    handleAnimationChange = animation => () =>
    this.setState(prevState => ({ animation, visible: !prevState.visible }))

    handleDirectionChange = direction => () => this.setState({ direction, visible: false })

  render() {
    const { animation, dimmed, direction, visible, charts} = this.state

    return (
      <div className='_sideBarDiv'>
        <Button className={visible ? '_red _newGraphBtn' : '_newGraphBtn'} onClick={this.handleAnimationChange('scale down')}>{visible ? 'Close' : 'New Chart'}</Button>
        <Sidebar.Pushable className='_graphDiv' as={Segment}>
          <VerticalSidebar validateForm={this.validateForm}
          handleChange={this.handleChange}
          submitChanges={this.submitChanges}
          state={this.state}
          animation={animation}
          direction={direction}
          visible={visible} />
          <Sidebar.Pusher dimmed={dimmed && visible}>
            <Segment className='_graphInnerDiv' basic>
              { charts.length > 0 ?
                charts.map(chart => {
                  return chart.element
                })
                : <h1>No Charts</h1> }
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}


export default Dashboard;
