import Head from "next/head";
import Table from "react-bootstrap/Table";
import { Alert, Container, Pagination } from "react-bootstrap";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
  count: number;
  page: number;
  limit: number;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const page = parseInt(ctx.query.page as string) || 1;
  const limit = parseInt(ctx.query.limit as string) || 20;
  try {
    const res = await fetch(`http://localhost:3000/users?page=${page}&limit=${limit}`);
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [], count: 0, page, limit } };
    }
    const data = await res.json();
    return {
      props: { statusCode: 200, users: data.data, count: data.count, page, limit }
    };
  } catch (e) {
    return { props: { statusCode: 500, users: [], count: 0, page, limit } };
  }
}

export default function Home({ statusCode, users, count, page, limit }: TGetServerSideProps) {
  const router = useRouter();
  const totalPages = Math.ceil(count / limit);
  const maxPagesToShow = 10;

  let startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
  let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  if (endPage - startPage + 1 < maxPagesToShow && startPage > 1) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const handlePageClick = (pageNumber: number) => {
    router.push(`/?page=${pageNumber}&limit=${limit}`);
  };

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <h1>Пользователи</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination>
          <Pagination.First onClick={() => handlePageClick(1)} disabled={page === 1} />
          <Pagination.Prev onClick={() => handlePageClick(page - 1)} disabled={page === 1} />
          {Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx).map(number => (
            <Pagination.Item key={number} active={number === page} onClick={() => handlePageClick(number)}>
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageClick(page + 1)} disabled={page === totalPages} />
          <Pagination.Last onClick={() => handlePageClick(totalPages)} disabled={page === totalPages} />
        </Pagination>
      </Container>
    </>
  );
}
