import React, { Component } from 'react';
import { TOPCOUNTRYLIST, COUNTRYLIST } from '../constant/countryList.constant';
import {
  ICountrySelectProps,
  ICountrySelectState,
  ICountrylist,
} from '../types/country';
/*
 * Country list taken from below link
 * https://www.worldometers.info/geography/how-many-countries-are-there-in-the-world/
 */
const countryJSONList = JSON.parse(COUNTRYLIST) as ICountrylist[];
export class AutoComplete extends Component<
  ICountrySelectProps,
  ICountrySelectState
> {
  wrapperRef: any;
  buttonRef: any;
  constructor(props: ICountrySelectProps) {
    super(props);
    this.state = {
      countryList: [],
      phone: '',
      selectedFlag: require('../assets/images/flags/united states.svg'),
      contactPlaceholder:
        props.placeholder !== undefined ? props.placeholder : 'Phone Number',
      inputId: props.inputId !== undefined ? props.inputId : 'cNumber',
      inputName: props.inputName !== undefined ? props.inputName : 'phone',
      countryCode: '+' + TOPCOUNTRYLIST[0].value,
      country: TOPCOUNTRYLIST[0].label,
      topCountryList: [],
      cursor: 0,
      filter: '',
      activeScrollElement: 0,
    };
    this.wrapperRef = React.createRef();
    this.buttonRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.escFunction = this.escFunction.bind(this);
  }

  toggleList = () => {
    if (this.state.countryList.length === 0) {
      this.setState({
        ...this.state,
        topCountryList: TOPCOUNTRYLIST,
        countryList: TOPCOUNTRYLIST.concat(countryJSONList.slice(0, 50)),
      });
      const nodes = document.querySelectorAll('.country-list');
      nodes[nodes.length - 1].classList.toggle('hide');
      document.getElementById('SearchCountry')?.focus();
      setTimeout(() => {
        this.setState({
          ...this.state,
          countryList: [
            ...this.state.countryList,
            ...countryJSONList.slice(50, countryJSONList.length),
          ],
        });
      }, 10);
    } else {
      this.setState({
        ...this.state,
        countryList: [],
        topCountryList: [],
        filter: '',
      });
      const nodesChild = document.querySelectorAll('.country-list');
      nodesChild[nodesChild.length - 1].classList.toggle('hide');
    }
  };

  countryChange = (selected: ICountrylist) => {
    const name: string = selected.value;
    if (!name) return;
    const result = this.state.countryList.filter(
      (x: ICountrylist) => x.value === name
    );
    if (result.length > 0) {
      this.setState(
        {
          ...this.state,
          country: result[0].label,
          countryCode: result.length > 0 ? '+' + result[0].value : '',
          phone: '',
          selectedFlag: require('../assets/images/flags/' +
            selected.label.toLowerCase() +
            '.svg'),
        },
        () => {
          const data = {
            country: this.state.country,
            countryCode: this.state.countryCode,
            phone: this.state.phone,
          };
          this.toggleList();
          this.props.setCountryContact(data);
        }
      );
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState(
        {
          ...this.state,
          phone: value,
        },
        () => {
          const data = {
            country: this.state.country,
            countryCode: this.state.countryCode,
            phone: this.state.phone,
          };
          this.props.setCountryContact(data);
        }
      );
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', (e) => {
      this.handleClickOutside(e);
    });
  }

  handleClickOutside(event: any) {
    if (
      this.wrapperRef &&
      !this.wrapperRef?.current?.contains(event.target) &&
      !this.buttonRef?.current?.contains(event.target)
    ) {
      if (this.state.countryList.length > 0) {
        this.toggleList();
      }
    }
  }

  escFunction(event: any) {
    console.log(event);
    if (event.keyCode === 27) {
      if (this.state.countryList.length > 0) {
        this.toggleList();
      }
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value.trimLeft();
    event.target.value = event.target.value.trimLeft();
    const arr = countryJSONList.filter(
      (val: ICountrylist) =>
        val.label.toLowerCase().includes(value.toLowerCase()) === true
    );
    this.setState({
      ...this.state,
      filter: value,
      countryList: value === '' ? TOPCOUNTRYLIST.concat(countryJSONList) : arr,
      activeScrollElement: 0,
    });
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    const { activeScrollElement, countryList } = this.state;
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.countryChange(countryList[activeScrollElement]);
      this.setState({
        activeScrollElement: 0,
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeScrollElement === 0) {
        return;
      }
      // Find current active element of li and put scroller
      this.setState({ activeScrollElement: activeScrollElement - 1 });
      const scrollerUp = document.getElementById(
        (activeScrollElement - 1).toString()
      );
      scrollerUp?.scrollIntoView({
        behavior: 'auto',
      });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeScrollElement === countryList.length - 1) {
        return;
      }
      // Find current active element of li and put scroller
      const scrollerDown = document.getElementById(
        (activeScrollElement + 1).toString()
      );
      scrollerDown?.scrollIntoView({
        behavior: 'auto',
      });
      this.setState({ activeScrollElement: activeScrollElement + 1 });
    }
  };

  render() {
    return (
      <div id='cNum'>
        <div>
          <div id='countryList' onClick={this.toggleList} ref={this.buttonRef}>
            <img
              src={this.state.selectedFlag}
              className='lazy'
              width='25'
              height='13'
              alt='Country Flag'
            />
            <label>{this.state.countryCode}</label>
          </div>
          <div className={'country-list hide'} ref={this.wrapperRef}>
            <div className='input-col search-country-main'>
              <input
                type='text'
                className='form-control search-country'
                name={`SearchCountry`}
                onChange={this.handleChange}
                value={this.state.filter}
                id={`SearchCountry`}
                placeholder='Search'
                autoComplete='off'
                onKeyDown={(e) => this.onKeyDown(e)}
              />
            </div>
            <ul>
              {this.state.countryList.map(
                (item: ICountrylist, index: number) => {
                  return (
                    <li
                      id={`${index}`}
                      key={item.iso2}
                      onClick={() => this.countryChange(item)}
                      data-country-code={item.iso2}
                      className={`flag ${item.iso2} top ${
                        item.label === this.state.country ||
                        index === this.state.activeScrollElement
                          ? 'active'
                          : ''
                      } ${
                        index === this.state.topCountryList.length - 1 &&
                        this.state.filter === ''
                          ? 'divider'
                          : ''
                      }
                    ${this.state.cursor === index ? 'focus' : ''}`}
                    >
                      <div className='d-flex d-flex-row'>
                        {/* <div className={`flag-background ${item.iso2}`}></div> */}
                        <img
                          src={require(`../assets/images/flags/${item.label.toLowerCase()}.svg`)}
                          className='country-flag'
                          alt={item.label}
                        />
                        <label className='country-label'>{item.label}</label>
                        <label className='country-value'>+{item.value}</label>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
        <input
          type='text'
          placeholder={this.state.contactPlaceholder}
          className={'form-control ' + this.props?.className}
          id={this.state.inputId}
          name={this.state.inputName}
          value={this.state.phone}
          onChange={this.handleInputChange}
          maxLength={10}
        />
      </div>
    );
  }
}

export default AutoComplete;
