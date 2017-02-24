import React from 'react';
//noinspection JSUnresolvedVariable
import {PhoneNumberUtil, PhoneNumberFormat} from "google-libphonenumber";
import * as _ from 'lodash';
import countryCodes from 'iso-3166-1-alpha-2';
import './sh-input-phone.scss';

import ShInputSelect from 'sh-input-select'
import ShCore from 'sh-core';

let phoneUtil = PhoneNumberUtil.getInstance();

class ShInputPhone extends React.Component {
    constructor(props) {
        super(props);
        this.selectConfig = {
            getLabelDisplay: (option) => {
                return option.label;
            }
        };

        this.state = {
            countryList: this.getCountryOptions(),
            country: _.find(this.getCountryOptions(), {abb: props.country}),
            value: '',
            classList: {
                shInputPhone: true,
                empty: true
            },
            placeholderText: '',
            validStatus: 'unknown',
            requiredField: {showRequired: false}
        };
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.validate = this.validate.bind(this);
        this.isValidNumber = this.isValidNumber.bind(this);
        this.updateCountry = this.updateCountry.bind(this);
        this.internationalFormat = this.internationalFormat.bind(this);
        this.localFormat = this.localFormat.bind(this);
        this.getNumber = this.getNumber.bind(this);
        this.getCountryOptions = this.getCountryOptions.bind(this);
    }

    validate(onSubmit) {
        if (onSubmit) {
            this.state.classList.shTouched = true;
        }
        let rtn = {isValid: true};

        let value = _.trim(this.state.value);

        this.state.classList.shInvalid = false;

        if (this.props.required && this.state.value.trim() === '') {
            this.state.classList.shInvalid = true;

            rtn.isValid = false;
            rtn.msg = 'Required';
        } else if (!_.isEmpty(value) && !this.isValidNumber(value)) {
            this.state.classList.shInvalid = true;
            rtn = {
                isValid: false,
                msg: 'Invalid Email Address'
            };
        }
        let newState = _.clone(this.state);
        this.setState(newState);
        return rtn;
    };

    componentWillMount() {
        if (this.props.validator) {
            this.props.validator.register(this, this.validate);
        }
    };

    componentWillUnmount() {
        if (this.props.validator) {
            this.props.validator.unregister(this);
        }
    };

    componentWillReceiveProps(props) {
        if (props.value && !_.isUndefined(props.value) && !_.isEqual(props.value, this.state.value)) {
            let newState = _.clone(this.state);
            newState.classList.empty = !props.value;
            let code = '+' + this.state.country.countryCode.toString();
            newState.value = this.localFormat(props.value.replace(code, ''), this.state.country.abb, phoneUtil);
            this.setState(newState, this.validate);
        }
    }

    componentDidMount() {
        if (this.props.value) {
            this.setState(
                {
                    value: this.props.value,
                    classList: {shInputPhone: true}
                }
            )
        }

        if (this.props.required) {
            this.setState({requiredField: {showRequired: true}});
        }

        this.state.placeholderHolder = this.state.placeholderText;
    }

    getCountryOptions() {
        return _.map(countryCodes.getData(), (country, abrev) => {
            let countryCode = phoneUtil.getCountryCodeForRegion(abrev);
            return {
                label: `+${countryCode}`,
                name: `${country} +${countryCode}`,
                abb: abrev,
                id: countryCode,
                countryCode: countryCode
            };
        });
    };

    handlePhoneChange(event) {
        let val = event.target.value.toString() || '';
        val = val.replace(/\D/g, '');

        this.setState({value: this.localFormat(val, this.state.country.abb, phoneUtil)}, () => {
            if (this.props.validator) {
                this.props.validator.validate()
            } else {
                this.validate();
            }
        });
        this.props.onChange(this.internationalFormat(val, this.state.country.abb, phoneUtil));

    };

    handleFocus(event) {
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }

        let newClassList = _.clone(this.state.classList);
        newClassList.shTouched = true;
        this.state.placeholderText = '';

        if (!_.isUndefined(this.refs.input)) {
            this.refs.input.focus();
        }
        this.setState({
            placeholderText: '',
            classList: newClassList
        });
    };

    handleBlur(event) {
        this.validate();
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
        let newState = _.clone(this.state);
        newState.placeholderText = newState.placeholderHolder;
        newState.classList.empty = !this.state.value;
        newState.requiredField.showRequired = (this.state.value.length < 1 && this.props.required);
        this.setState(newState);
    }

    isValidNumber(phone) {
        if (phone && phone.length > 1) {
            try {
                let phoneNumber = phoneUtil.parse(phone, this.state.country.abb);
                return phoneUtil.isValidNumber(phoneNumber, PhoneNumberFormat.INTERNATIONAL);
            } catch (e) {
                return false;
            }

        } else {
            return phone;
        }
    }

    getNumber(phoneNumber, regionCode, googlePhone) {
        return googlePhone.parseAndKeepRawInput(phoneNumber, regionCode);
    }

    localFormat(value, regionCode = 'US', googlePhone) {
        try {
            return googlePhone.format(this.getNumber(value, regionCode, googlePhone), PhoneNumberFormat.NATIONAL);
        } catch (e) {
            return value
        }
    }

    internationalFormat(phoneNumber, regionCode = 'US', googlePhone) {
        try {
            return googlePhone.format(this.getNumber(phoneNumber, regionCode, googlePhone), PhoneNumberFormat.E164);
        } catch (e) {
            return phoneNumber
        }
    }

    updateCountry(value) {
        this.setState({country: value}, () => {
            this.props.onChange(this.internationalFormat(this.state.value, value.abb, phoneUtil));
        })
    }

    render() {
        let {
            value,
            validator,
            onFocus,
            onBlur,
            required,
            country,
            ...other
        } = this.props;

        return (
            <div autoFocus="-1"
                 className={this.props.className ? ShCore.getClassNames(this.state.classList) + ' ' + this.props.className : ShCore.getClassNames(this.state.classList)}>
                <ShInputSelect value={this.state.country} options={this.state.countryList} onChange={this.updateCountry}
                               config={this.selectConfig}/>
                <div
                    className="sh-input-phone-text">
                    <label>
                        <span className="label">{this.props.label}</span>
                        <span
                            className={"required-label " + ShCore.getClassNames(this.state.requiredField)}>required</span>
                        <input ref="input"
                               className="sh-phone-input"
                               type="text"
                               {...other}
                               placeholder={this.state.placeholderText}
                               onChange={this.handlePhoneChange}
                               onFocus={this.handleFocus}
                               onBlur={this.handleBlur}
                               value={this.state.value}
                        />
                    </label>
                </div>
            </div>
        )
    }
}

ShInputPhone.propTypes = {
    validator: React.PropTypes.object,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func,
    label: React.PropTypes.string,
    required: React.PropTypes.bool,
    country: React.PropTypes.string
};

ShInputPhone.defaultProps = {
    validator: null,
    onChange: _.noop,
    label: '',
    required: false,
    country: 'US'
};

export default ShInputPhone;