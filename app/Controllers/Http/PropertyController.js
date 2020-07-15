'use strict'

const Property = use('App/Models/Property')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   *
  
   */
  async index ({ request }) {
    const { latitude, longitude } = Property.all()

    const properties = Property.query()
      .with('images')
      .nearBy(latitude, longitude, 10)
      .fetch()

    return properties
  }

  /**
   * Render a form to be used for creating a new property.
   * GET properties/create
   */
 
  /**
   * Create/save a new property.
   * POST properties
   */
  async store ({ auth, request, response }) {
    const { id } = auth.user
    const data = request.only([
      'title',
      'adress',
      'latitude',
      'longitude',
      'price'
    ])

    const property = await Property.create({ ...data, user_id: id})

    return property
  }

  /**
   * Display a single property.
   * GET properties/:id

   */
  async show ({ params}) {
    const property = await  Property.findOrFail(params.id)

    await property.load('images')

    return property
  }

  /**
   * Render a form to update an existing property.
   * GET properties/:id/edit
   *
   */
 

  /**
   * Update property details.
   * PUT or PATCH properties/:id

   */
  async update ({ params, request, response }) {
    const property = await Property.findOrFail(params.id)

    const data = request.only([
      'title',
      'adress',
      'latitude',
      'longitude',
      'price'
    ])

    property.merge(data)

    await property.save()

    return property
  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
  
   */
  async destroy ({ params, auth, response }) {
    const property = await Property.findOrFail(params.id)

    if(property.user_id !== auth.user.id) {
      return response.status(401).send({ err: 'Not authorized'})
    }

    await property.delete()
  }
}

module.exports = PropertyController
