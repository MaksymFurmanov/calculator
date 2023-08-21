function CalculatorButton(props) {
    let signStyles;
    if (props.sign === "small") signStyles = "sign-small";
    if (props.sign === "mid") signStyles = "sign-mid";

    const styles = {
        backgroundColor: props.backgroundColor,
    }

    return (
        <div style={styles} className={"calculator-button"}>
            <p className={signStyles}>{props.children}</p>
        </div>
    )
}

export default CalculatorButton;