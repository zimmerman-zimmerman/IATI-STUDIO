import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {Tooltip} from '../../../general/Tooltip.react.jsx'
import {GeneralLoader} from '../../../general/Loaders.react.jsx'
import {withRouter, Link} from 'react-router';
import {
    getCodeListItems,
    getParticipatingOrganisations,
    createParticipatingOrganisation,
    updateParticipatingOrganisation,
    deleteParticipatingOrganisation
} from '../../../../actions/activity'
import {renderField, renderNarrativeFields, renderSelectField} from '../../helpers/FormHelper'
import {participatingOrganisationsSelector, publisherSelector} from '../../../../reducers/createActivity.js'

import handleSubmit from '../../helpers/handleSubmit'

const renderParticipatingOrganisation = ({fields, roleOptions, typeOptions, languageOptions, meta: {touched, dirty}}) => {
    if (!fields.length && !dirty) {
        fields.push({})
    }

    return (
        <div>
            {fields.map((organisation, index) =>
                <div key={index}>
                    <div className="field-list clearfix">
                        <Field
                            component={renderSelectField}
                            name={`${organisation}role.code`}
                            textName={`${organisation}role.code`}
                            label="Organisation role"
                            selectOptions={roleOptions}
                            defaultOption="Select an organisation role"
                        />
                        <div className="columns small-6">
                            <Field
                                component={renderField}
                                name={`${organisation}ref`}
                                label="Organisation identifier"
                                type="text"
                            />
                        </div>
                        <Field
                            component={renderSelectField}
                            name={`${organisation}type.code`}
                            textName={`${organisation}type.code`}
                            label="Organisation Type"
                            selectOptions={typeOptions}
                            defaultOption="Select an organisation type"
                        />
                        <div className="columns small-6">
                            <Field
                                component={renderField}
                                name={`${organisation}activity_id`}
                                label="Activity identifier"
                                type="text"
                            />
                        </div>
                        <FieldArray
                            name={`${organisation}narratives`}
                            component={renderNarrativeFields}
                            languageOptions={languageOptions}
                        />
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

    const participatingOrganisations = values.participatingOrganisations || []

    errors.participatingOrganisations = participatingOrganisations.map(participatingOrganisation => {
        let participatingOrganisationErrors = {}

        if (!participatingOrganisation.type) {
            participatingOrganisationErrors.type = {code: 'Required'}
        }

        if (!participatingOrganisation.role) {
            participatingOrganisationErrors.role = {name: 'Required'}
        }

        if(!participatingOrganisation.ref) {
            participatingOrganisationErrors.ref = 'Required'
        }

        if(!participatingOrganisation.activity_id) {
            participatingOrganisationErrors.activity_id = 'Required'
        }

        const narratives = participatingOrganisation.narratives || []

        participatingOrganisationErrors.narratives = narratives.map(narrative => {
            let narrativeErrors = {}

            if (!narrative.text) {
                narrativeErrors.text = 'Required'
            }

            if (!narrative.language) {
                narrativeErrors.language = {code: 'Required'}
            }

            return narrativeErrors
        })

        if (!narratives.length) {
            participatingOrganisationErrors.narratives._error = 'At least one narrative must be entered'
        }

        return participatingOrganisationErrors
    })

    if (!participatingOrganisations.length) {
        errors.participatingOrganisations._error = 'At least one participatingOrganisation must be entered'
    }

    return errors
};

class ParticipatingOrganisationForm extends Component {

    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(formData) {
        const {activityId, data, publisher} = this.props

        handleSubmit(
            publisher.id,
            'participating_organisations', // form key
            activityId,
            data,
            formData['participating_organisations'],
            this.props.createParticipatingOrganisation,
            this.props.updateParticipatingOrganisation,
            this.props.deleteParticipatingOrganisation,
        ).then((result) => {
            if (!result.error) {
                this.props.router.push(`/publisher/activities/${activityId}/geopolitical-information/country`)
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    componentWillMount() {
        this.props.getCodeListItems('OrganisationRole');
        this.props.getCodeListItems('OrganisationType');
        this.props.getCodeListItems('Language');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            const oldData = this.props.data
            const newData = nextProps.data

            // TODO: is a bug in redux-form, check https://github.com/erikras/redux-form/issues/2058 - 2016-12-22
            // this.props.change('participatingOrganisations', newData);

            // change each item
            newData.forEach((d, i) => this.props.change(`participating_organisations[${i}]`, d))

            // remove any removed elements if newData < oldData
            for (let i = newData.length; i < oldData.length; i++) {
                this.props.array.remove('participating_organisations', i)
            }
        }

        if ((nextProps.publisher && nextProps.publisher.id) && (this.props.activityId !== nextProps.activityId || this.props.publisher !== nextProps.publisher
            || !(this.props.data && this.props.data.length))) {
            this.props.getParticipatingOrganisations(nextProps.publisher.id, nextProps.activityId)
        }
    }

    render() {
        const {handleSubmit, submitting, data, codelists, activityId} = this.props;

        if (!data || !codelists.OrganisationRole || !codelists.OrganisationType || !codelists.Language) {
            return <GeneralLoader/>
        }

        return (
            <div>
                <div className="row controls">
                    <div className="columns small-centered small-12">
                        <h2 className="page-title with-tip">IATI activity</h2>
                        <Tooltip className="inline" tooltip="Info text goes here"><i className="material-icons">info</i></Tooltip>
                    </div>
                </div>
                <form onSubmit={handleSubmit(this.handleFormSubmit)} name="participatingOrganisation">
                    <div className="row no-margin">
                        <div className="columns small-12">
                            <h6>Participating organisation </h6>
                            <FieldArray
                                name="participating_organisations"
                                component={renderParticipatingOrganisation}
                                roleOptions={codelists["OrganisationRole"]}
                                typeOptions={codelists["OrganisationType"]}
                                languageOptions={codelists["Language"]}
                            />
                        </div>
                    </div>
                    <div className="columns small-12">
                        <Link className="button" to={`/publisher/activities/${activityId}/basic-info/contact`}>Back to
                            basic
                            information</Link>
                        <button className="button float-right" type="submit" disabled={submitting}>
                            Continue to geopolitical information
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

ParticipatingOrganisationForm = reduxForm({
    form: 'participating-organisation',
    destroyOnUnmount: false,
    enableReinitialize: true,
    validate,
})(ParticipatingOrganisationForm);

function mapStateToProps(state, props) {
    const participatingOrganisations = participatingOrganisationsSelector(state);

    return {
        activity: state.activity,
        data: participatingOrganisations,
        initialValues: {"participating_organisations": participatingOrganisations},  // populate initial values for redux form
        publisher: publisherSelector(state),
        ...props,
    }
}


ParticipatingOrganisationForm = connect(mapStateToProps, {
    getCodeListItems,
    getParticipatingOrganisations,
    createParticipatingOrganisation,
    updateParticipatingOrganisation,
    deleteParticipatingOrganisation,
})(ParticipatingOrganisationForm);

export default withRouter(ParticipatingOrganisationForm);
