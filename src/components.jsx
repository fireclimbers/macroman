import React from 'react';


class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: props.name || '',
      cals: props.cals || '',
      protein: props.protein || '0',
      fat: props.fat || '0',
      carbs: props.carbs || '0',
      servings: props.servings || "1",
      totalservings: props.totalservings || "1",
      volume: props.volume || '',
      vol_unit: props.vol_unit || '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.editing !== this.props.editing) {
      this.setState({
        name: this.props.item.name || '',
        cals: this.props.item.cals || '',
        protein: this.props.item.protein || '0',
        fat: this.props.item.fat || '0',
        carbs: this.props.item.carbs || '0',
        servings: this.props.item.servings || '1',
        totalservings: this.props.item.totalservings || '1',
        amount: this.props.item.amount,
        unit: this.props.item.unit,
        volume: this.props.item.volume || '',
        vol_unit: this.props.item.vol_unit || ''
      })
    }
  }
  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <div className="columns">
            <div className="column">
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input 
                        id="name"
                        className="input is-small" 
                        type="text" 
                        placeholder="Name"
                        ref={(input) => { this.nameInput = input; }}
                        onChange={this.handleChange}
                        value={this.state.name} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="cals"
                        className="input is-small" 
                        type="text" 
                        placeholder="Cals"
                        onChange={this.handleChange}
                        value={this.state.cals} />
                    </p>
                  </div>

                  <div className="field">
                    <p className="control">
                      <input 
                        id="protein"
                        className="input is-small" 
                        type="text" 
                        placeholder="Protein"
                        onChange={this.handleChange}
                        value={this.state.protein} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="fat"
                        className="input is-small" 
                        type="text" 
                        placeholder="Fat"
                        onChange={this.handleChange}
                        value={this.state.fat} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="carbs"
                        className="input is-small" 
                        type="text" 
                        placeholder="Carbs"
                        onChange={this.handleChange}
                        value={this.state.carbs} />
                    </p>
                  </div>

                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input 
                        id="servings"
                        className="input is-small" 
                        type="text" 
                        placeholder="Servings"
                        onChange={this.handleChange}
                        value={this.state.servings} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="totalservings"
                        className="input is-small" 
                        type="text" 
                        placeholder="Total servings"
                        onChange={this.handleChange}
                        value={this.state.totalservings} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="amount"
                        className="input is-small" 
                        type="text" 
                        placeholder="Amount"
                        onChange={this.handleChange}
                        value={this.state.amount} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="unit"
                        className="input is-small" 
                        type="text" 
                        placeholder="Unit"
                        onChange={this.handleChange}
                        value={this.state.unit} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="volume"
                        className="input is-small" 
                        type="text" 
                        placeholder="Volume"
                        onChange={this.handleChange}
                        value={this.state.volume} />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control">
                      <input 
                        id="vol_unit"
                        className="input is-small" 
                        type="text" 
                        placeholder="Unit"
                        onChange={this.handleChange}
                        value={this.state.vol_unit} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-body">
                  
                  <div className="field">
                    <div className="control">
                      <button className="button is-primary">
                        Add item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
    );
  }

  handleChange(e) {
    var args = {};
    args[e.target.id] = e.target.value;
    this.setState(args);
  }

  handleSubmit(e) {
    e.preventDefault();
    /*if (!this.state.text.length) {
      return;
    }*/
    const newItem = {
      name: this.state.name,
      cals: this.state.cals,
      protein: this.state.protein,
      fat: this.state.fat,
      carbs: this.state.carbs,
      servings: this.state.servings,
      totalservings: this.state.totalservings,
      amount: this.state.amount,
      unit: this.state.unit,
      volume: this.state.volume,
      vol_unit: this.state.vol_unit,
    };
    this.props.handleSubmit(newItem);
    this.setState(state => ({
      name: '',
      cals: '',
      protein: '0',
      fat: '0',
      carbs: '0',
      servings: '1',
      totalservings: '1',
      amount: '',
      unit: '',
      volume: '',
      vol_unit: ''
    }));
    this.nameInput.focus();
  }
}

export { ItemForm }