import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form'
import Tooltip from '../../../general/Tooltip.react.jsx'
import {renderSelectField} from '../../helpers/FormHelper'
import {GeneralLoader} from '../../../general/Loaders.react.jsx'
import {connect} from 'react-redux'
import {
    getCodeListItems,
    getPerformanceCondition,
    createPerformanceCondition,
    updatePerformanceCondition,
    deletePerformanceCondition
} from '../../../../actions/activity'
import {publisherSelector} from '../../../../reducers/createActivity.js'
import { Link } from 'react-router';
import { withRouter } from 'react-router'
import handleSubmit from '../../helpers/handleSubmit'


const validate = values => {
    const errors = {};

    if (!values.attached) {
        errors.type = 'Required'
    }
    return errors
};

class PerformanceConditionForm extends Component {

    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    /**
     * Submit performance's comment data and redirect to result form
     *
     * @param formData
     */
    handleFormSubmit(formData) {
        const {activityId, publisher, data, router} = this.props;
        const conditions = formData.conditions;
        conditions.activity = activityId;

        handleSubmit(
            publisher.id,
            'conditions',
            activityId,
            [data],
            [conditions],
            this.props.createPerformanceCondition,
            this.props.updatePerformanceCondition,
            this.props.deletePerformanceCondition,
        ).then((result) => {
            if (!result.error) {
                router.push(`/publisher/activities/${activityId}/performance/result`)
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    componentWillMount() {
        this.props.getCodeListItems('ConditionType');
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activityId !== nextProps.activityId || this.props.publisher !== nextProps.publisher) {
            //if (this.props.activityId && this.props.publisher) {
            this.props.getActivity(nextProps.publisher.id, nextProps.activityId)
        }
    }

    render() {
        const {handleSubmit, submitting, codelists, activityId} = this.props;

        if (!codelists.ConditionType) {
            return <GeneralLoader/>
        }

        return (
            <div className="columns small-centered small-12">
                <h2 className="page-title with-tip">Condition</h2>
                <Tooltip className="inline" tooltip="Description text goes here">
                    <i className="material-icons">info</i>
                </Tooltip>
                <form onSubmit={handleSubmit(this.handleFormSubmit)}>

                    <div className="field-list clearfix">
                        <div className="row no-margin">
                            <Field
                                component={renderSelectField}
                                name="conditions.attached"
                                textName="conditions.attached"
                                label="Condition Attached"
                                selectOptions={[{code: 'True', name: 'True'}, {code: 'False', name: 'False'}]}
                                defaultOption="Select one of the following options"
                            />
                            {/*
                            <Field
                                component={renderSelectField}
                                name="conditions.type"
                                textName="conditions.type"
                                label="Condition Type"
                                selectOptions={codelists.ConditionType}
                                defaultOption="Select one of the following options"
                            />
                            */}
                        </div>
                    </div>
                    <div className="columns small-12">
                        <Link className="button" to={`/publisher/activities/${activityId}/relations/relations`}>Back to relation</Link>
                        <button className="button float-right" type="submit" disabled={submitting}>
                            Continue to performance result
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}


function mapStateToProps(state, props) {
    const {activityId} = props;
    let currentActivity = state.activity.activity && state.activity.activity[activityId];
    let conditions = currentActivity && currentActivity.conditions;
    if (currentActivity && !conditions) {
        conditions = {};
    }

    return {
        data: conditions,
        codelists: state.codelists,
        initialValues: {"conditions": conditions},  // populate initial values for redux form
        publisher: publisherSelector(state),
        ...props,
    }
}

PerformanceConditionForm = reduxForm({
    form: 'performance-condition',     // a unique identifier for this form
    destroyOnUnmount: false,
    enableReinitialize: true,
    validate
})(PerformanceConditionForm);

PerformanceConditionForm = connect(mapStateToProps, {
    getCodeListItems,
    getPerformanceCondition,
    createPerformanceCondition,
    updatePerformanceCondition,
    deletePerformanceCondition
})(PerformanceConditionForm);

export default withRouter(PerformanceConditionForm);

