import SideBar from "../components/Sidebar";
import "./CreditPage.css";

const CreditPage = () => {
  return (
    <div>
      <SideBar />
      <div className="credit-bg">
        <div className="credit-container">
          <h1 className="title">TO-DO LIST</h1>
          <h3>จัดทำโดย</h3>
          <ul>
            <li>6434402423 กริชลักษณ์ อนันต์สิริวุฒิ</li>
            <li>6434412723 จิรพัฒน์ ธนสุทธิวัฒน์</li>
            <li>6434448323 ปณชัย วงศ์วีรธร</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreditPage;
