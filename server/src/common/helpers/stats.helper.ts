import { GroupBy } from 'src/modules/statics/dto/stat.dto';

export const meses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const dias = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

export const makeGroupBy = (groupBy?: GroupBy) => {
  let response;

  switch (groupBy) {
    case GroupBy.DAY_OF_WEEK:
      response = { $dayOfWeek: '$localCreatedAt' };
      break;
    case GroupBy.DAY_OF_MONTH:
      response = { $dayOfMonth: '$localCreatedAt' };
      break;
    case GroupBy.MONTH:
      response = { $month: '$localCreatedAt' };
      break;
    case GroupBy.YEAR:
      response = { $year: '$localCreatedAt' };
      break;
    default:
      response = { $month: '$localCreatedAt' };
      break;
  }

  return response;
};

export const makeResponse = (
  posts: any,
  groupBy?: GroupBy,
  startDate?: string,
  endDate?: string,
) => {
  let result = {};

  switch (groupBy) {
    case GroupBy.YEAR:
      result = {};

      const start = startDate
        ? new Date(startDate).getFullYear()
        : new Date().getFullYear();
      const end = endDate ? new Date(endDate).getFullYear() : start;

      const from = Math.min(start, end);
      const to = Math.max(start, end);

      for (let y = from; y <= to; y++) {
        result[y] = 0;
      }

      for (const p of posts) {
        const year = p._id;
        result[year] = p.total;
      }
      break;

    case GroupBy.MONTH:
      result = Object.fromEntries(meses.map((m) => [m, 0]));
      for (const p of posts) {
        const mesNombre = meses[p._id - 1];
        result[mesNombre] = p.total;
      }
      break;

    case GroupBy.DAY_OF_MONTH:
      for (let i = 1; i <= 31; i++) {
        result[i] = 0;
      }
      for (const p of posts) {
        const dia = p._id;
        result[dia] = p.total;
      }
      break;

    case GroupBy.DAY_OF_WEEK:
      result = Object.fromEntries(dias.map((d) => [d, 0]));
      for (const p of posts) {
        const diaNombre = dias[p._id - 1];
        result[diaNombre] = p.total;
      }
      break;

    default:
      result = Object.fromEntries(posts.map((p) => [p._id, p.total]));
      break;
  }

  return result;
};
