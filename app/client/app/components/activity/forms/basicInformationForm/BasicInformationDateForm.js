import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {Tooltip} from '../../../general/Tooltip.react.jsx'
import {Link} from 'react-router';
import {GeneralLoader} from '../../../general/Loaders.react.jsx'
import {renderNarrativeFields, renderField, renderSelectField} from '../../helpers/FormHelper'
import {getCodeListItems, getActivity, createDate, updateDate, deleteDate} from '../../../../actions/activity'
import {publisherSelector} from '../../../../reducers/createActivity.js'
import {withRouter} from 'react-router'
import handleSubmit from '../../helpers/handleSubmit'

const renderDate = ({fields, languageOptions, dateTypeOptions, meta: {touched, dirty, error}}) => {
    if (!fields.length && !dirty) {
        fields.push({})
    }

    return (
        <div>
            {fields.map((activity_dates, index) =>
                <div key={index}>
                    <div className="field-list">
                        <div className="row no-margin">
                            <div className="columns small-6">
                                <Field
                                    name={`${activity_dates}.iso_date`}
                                    type="date"
                                    component={renderField}
                                    label="Date"
                                />
                            </div>
                            <Field
                                name={`${activity_dates}.type[code]`}
                                textName={`${activity_dates}.type.code`}
                                component={renderSelectField}
                                label="Type"
                                selectOptions={dateTypeOptions}
                                defaultOption="Select a type"
                            />
                            {/* @TODO uncomment when issue #949 is fixed
                            <FieldArray
                                name={`${activity_dates}.narratives`}
                                component={renderNarrativeFields}
                                languageOptions={languageOptions}
                                textName="textTitle"
                                textLabel="Text"
                            />
                            */}
                        </div>
                    </div>
                    <div className="columns">
                        <button className="control-button add" type="button" onClick={() => fields.push({})}>Add More
                        </button>
                        <button
                            type="button"
                            title="Remove Title"
                            className="control-button remove float-right"
                            onClick={() => fields.remove(index)}>Delete
                        </button>
                        {touched && error && <span className="error">{error}</span>}
                    </div>
                    <br/><br/>
                </div>
            )}
        </div>
    )
};

const validate = values => {
    let errors = {};

    const activityDates = values.activity_dates || [];

    errors.activity_dates = activityDates.map(dateData => {
        let dateErrors = {};

        if (!dateData.type || !dateData.type.code || dateData.type.code == "Select a type") {
            dateErrors.type = {code: 'Required'}
        }

        return dateErrors
    });

    return errors
};


class BasicInformationDateForm extends Component {

    constructor(props) {
        super(props)
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    /**
     * Submit basic information's description data and redirect to status form.
     *
     * @param formData
     */
    handleFormSubmit(formData) {
        const {activityId, publisher, data} = this.props;

        const lastDates = data;
        let activityDates = formData.activity_dates;

        activityDates = activityDates.map(function (date) {
            if (date.iso_date) {
                let dateObj = new Date(date.iso_date);
                date.iso_date = dateObj.toISOString();
            }
            return date;
        });

        handleSubmit(
            publisher.id,
            'activity_dates',
            activityId,
            lastDates,
            activityDates,
            this.props.createDate,
            this.props.updateDate,
            this.props.deleteDate,
        ).then((result) => {
            if (!result.error) {
                this.props.router.push(`/publisher/activities/${activityId}/basic-info/contact`)
            }
        }).catch((e) => {
            console.log(e)
        });
    }

    componentWillMount() {
        this.props.getCodeListItems('ActivityDateType');
        this.props.getCodeListItems('Language');
        if (this.props.publisher && this.props.publisher.id) {
            this.props.getActivity(this.props.publisher.id, this.props.activityId)
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.activityId !== nextProps.activityId || this.props.publisher !== nextProps.publisher) {
            this.props.getActivity(nextProps.publisher.id, nextProps.activityId)
        }
    }

    render() {
        const {codeLists, isFetching, submitting, handleSubmit, activity, activityId} = this.props;


        if (!activity || isFetching || !codeLists["ActivityDateType"] || !codeLists["Language"]) {
            return <GeneralLoader/>
        }

        return (
            <div className="columns small-centered small-12">
                <h2 className="page-title with-tip">Date</h2>
                <Tooltip className="inline" tooltip="Date text goes here">
                    <i className="material-icons">info</i>
                </Tooltip>
                <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                    <FieldArray
                        name="activity_dates"
                        component={renderDate}
                        languageOptions={codeLists["Language"]}
                        dateTypeOptions={codeLists["ActivityDateType"]}
                    />
                    <div className="columns small-12">
                        <Link className="button" to={`/publisher/activities/${activityId}/basic-info/status`}>Back to
                            status</Link>
                        <button className="button float-right" type="submit" disabled={submitting}>
                            Continue to contact
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    const {activityId} = props;
    const isFetching = state.activity.isFetching;
    let currentActivity = state.activity.activity && state.activity.activity[activityId];
    let activity_dates = currentActivity && currentActivity.activity_dates;

    return {
        data: activity_dates,
        isFetching: isFetching,
        activity: state.activity.activity,
        codeLists: state.codeLists,
        initialValues: {"activity_dates": activity_dates},  // populate initial values for redux form
        publisher: publisherSelector(state),
        ...props,
    }
}

BasicInformationDateForm = reduxForm({
    form: 'basic-info-date',     // a unique identifier for this form
    destroyOnUnmount: false,
    enableReinitialize: true,
    validate
})(BasicInformationDateForm);

BasicInformationDateForm = connect(mapStateToProps, {
    getCodeListItems,
    getActivity,
    createDate,
    updateDate,
    deleteDate,
})(BasicInformationDateForm);

export default withRouter(BasicInformationDateForm)

