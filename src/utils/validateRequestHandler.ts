import type { Schema } from 'joi'

type TRequestSchema = {
  body: any
  params: any
  query: any
}

const validateRequest = (schema: Schema, data: TRequestSchema): [false, string] | [true, null] => {
  const { body, params, query } = data

  const { error } = schema.validate({ body, params, query }, { abortEarly: true })

  if (error === undefined) {
    return [true, null]
  }

  const errorMessage = error.details[0].message
  return [false, errorMessage]
}

export default validateRequest
