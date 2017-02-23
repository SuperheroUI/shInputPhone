import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/lib/ReactTestUtils';
import * as _ from 'lodash';

let ShInputPhone = require('./sh-input-phone').default;

describe('root', function () {
    it('renders without problems', function () {
        let value = true;
        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value}/>);
        expect(root).toBeTruthy();
    });

    it('input styles not be set to empty if there is a value', function () {
        let value = '';

        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        root.handlePhoneChange({target:{value:2}});

        TestUtils.Simulate.blur(input);
        expect(rootNode.classList.length).toBe(1)
    });

    it('set classes from parent', function () {
        let value = '';
        let root = TestUtils.renderIntoDocument(<ShInputPhone className="spam" value={value} />);
        let rootNode = ReactDOM.findDOMNode(root);
        expect(rootNode.classList).toContain('spam');
    });


    it('handle having outside onBlur', function () {
        let value = '';
        let blurTest = 0;
        let onBlur = ()=> {
            blurTest = 1;
        };

        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} onBlur={onBlur}/>);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        TestUtils.Simulate.blur(input);
        expect(blurTest).toBe(1)
    });

    it('handle having outside onFocus', function () {
        let value = '0';
        let focusTest = 0;
        let onFocus = ()=> {
            focusTest = 1;
        };

        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} onFocus={onFocus}/>);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        TestUtils.Simulate.focus(input);
        expect(focusTest).toBe(1)
    });

    it('works a field is required', function () {
        let what = '0';
        let changeMe = () => {
            value = 1;
        };
        let root = TestUtils.renderIntoDocument(<ShInputPhone required value={what} onChange={changeMe}/>);
        let rootNode = ReactDOM.findDOMNode(root);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        expect(root.state.requiredField.showRequired).toBe(true);
        expect(input.placeholder).toBe('+');
    });

    it('the required label should not show up if the field is not required', function () {
        let what = '';
        let changeMe = () => {
            value = 1;
        };
        let root = TestUtils.renderIntoDocument(<ShInputPhone value={what} onChange={changeMe}/>);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        TestUtils.Simulate.focus(input);
        TestUtils.Simulate.blur(input);
        expect(root.state.requiredField.showRequired).toBe(false);
        expect(input.placeholder).toBe('+');
    });

    it('input styles be set to empty if there is no value', function () {
        let root = TestUtils.renderIntoDocument(<ShInputPhone  />);
        let rootNode = ReactDOM.findDOMNode(root);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        TestUtils.Simulate.blur(input);
        expect(rootNode.classList[1]).toBe('empty')
    });

    it('handle internal changes', function () {
        let value = '0';
        let changeMe = () => {
            value = 'hi';
        };

        let validator = {
            validate: _.noop,
            register: _.noop
        };
        spyOn(validator, 'validate');
        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} validator={validator} onChange={changeMe}/>);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');

        root.handlePhoneChange({
            target: {
                value: 'the fat lazy cat'
            }
        });
        expect(validator.validate).toHaveBeenCalled();

        TestUtils.Simulate.blur(input);
        expect(input.value).toBe('the fat lazy cat');
    });

    it('handle focus', function () {
        let value = '0';

        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value}/>);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');

        TestUtils.Simulate.focus(input);
    });

    it('handle internal changes w/o validator', function () {
        let value = '0';
        let changeMe = () => {
            value = 'hi';
        };

        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value}  onChange={changeMe}/>);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');

        root.handlePhoneChange({
            target: {
                value: 'the fat lazy cat'
            }
        });

        TestUtils.Simulate.blur(input);
        expect(input.value).toBe('the fat lazy cat');
    });

    it('handle internal changes w prop onchange', function () {
        let value = '0';

        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');

        root.handlePhoneChange({
            target: {
                value: 'the fat lazy cat'
            }
        });

        TestUtils.Simulate.blur(input);
        expect(input.value).toBe('the fat lazy cat');
    });

    it('should have a validator function', function(){
        let root = TestUtils.renderIntoDocument(<ShInputPhone />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        expect(root.validate().isValid).toBe(true);
    });

    it('should fail validator if there is no value and field is required', function(){
        let value = null;
        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} required />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        expect(root.validate().isValid).toBe(false);
    });

    it('should call register if a validator is present', function(){
        let value = null;
        let validator = {
            register: _.noop,
        };
        spyOn(validator, 'register');
        let root = TestUtils.renderIntoDocument(<ShInputPhone validator={validator} value={value} required />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-text-input');
        expect(validator.register).toHaveBeenCalled();
    });

    it('should call unregister if a validator is present', function(){
        let value = null;
        let validator = {
            register: _.noop,
            unregister: _.noop,
        };
        spyOn(validator, 'unregister');
        let root = TestUtils.renderIntoDocument(<ShInputPhone validator={validator} value={value} required />);
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(root).parentNode);
        expect(validator.unregister).toHaveBeenCalled();
    });

    it('should be able to unmount a plane component', function(){
        let value = null;
        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} required />);
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(root).parentNode);
    });

    it('should call set class to touched a form as been submitted by the shForm', function(){
        let value = null;
        let validator = {
            register: _.noop,
            unregister: _.noop,
        };
        spyOn(validator, 'unregister');
        let root = TestUtils.renderIntoDocument(<ShInputPhone validator={validator} value={value} required />);
        root.validate(true);
        expect(root.state.classList.shTouched).toBe(true);
    });

    it('changing props should update state', function(){
        let value = '0';
        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} required />);

        let props = {
            value: '0'
        };
        root.componentWillReceiveProps(props);
        expect(root.state.value).toBe('0')
    });

    it('changing props should update state', function(){
        let value = '1';
        let root = TestUtils.renderIntoDocument(<ShInputPhone value={value} required />);
        let props = {
            value: '0'
        };
        root.componentWillReceiveProps(props);
        expect(root.state.value).toBe('0')
    });
});
