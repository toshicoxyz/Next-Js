import { auth } from '@clerk/nextjs';

export default function getUserId() {
  const { userId } = auth();
  return <div>User Id: {userId}</div>;
}
